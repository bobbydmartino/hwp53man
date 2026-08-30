# pull_2026.py
# Export all 2026 users, their current submission, and full submissionHistory.
# Grading rule: a user's graded entry is their LATEST history snapshot saved at
# or before the deadline. Anything saved after the deadline is discarded.
#
# Outputs:
#   2026_export.json  - raw dump: every user, current doc, full history
#   2026_graded.csv   - one row per user: the submission we grade
#   2026_graded.json  - same graded set, full detail

from google.cloud import firestore
from google.oauth2 import service_account
from pathlib import Path
from datetime import datetime, timezone, timedelta
import csv
import json

PROJECT_ID = "hwp53man-7e6ab"
SERVICE_ACCOUNT_PATH = Path("serviceAccount.json")

# Saturday, August 29, 2026 at 11:59:59 PM PT (PDT = UTC-7)
DEADLINE = datetime(2026, 8, 30, 6, 59, 59, 999999, tzinfo=timezone.utc)


def to_iso(val):
    if val is None:
        return None
    try:
        if getattr(val, "tzinfo", None) is None:
            return val.replace(tzinfo=timezone.utc).isoformat()
        return val.isoformat()
    except Exception:
        return str(val)


def as_dt(val):
    if isinstance(val, datetime):
        return val if val.tzinfo else val.replace(tzinfo=timezone.utc)
    return None


def snap_summary(data):
    return {
        "version": data.get("version"),
        "updatedAt": to_iso(data.get("updatedAt")),
        "roster": data.get("roster") or [],
        "squad": data.get("squad") or [],
        "games": data.get("games") or {},
        "email": data.get("email"),
        "displayName": data.get("displayName"),
    }


def main():
    if not SERVICE_ACCOUNT_PATH.is_file():
        raise SystemExit("serviceAccount.json not found at project root.")

    creds = service_account.Credentials.from_service_account_file(str(SERVICE_ACCOUNT_PATH))
    client = firestore.Client(project=PROJECT_ID, credentials=creds)

    export = []
    graded = []
    late_discarded = 0

    for user_doc in client.collection("users").stream():
        uid = user_doc.id
        profile = user_doc.to_dict() or {}

        current_snap = client.collection("users").document(uid).collection("submission").document("current").get()
        current = current_snap.to_dict() if current_snap.exists else None

        history = []
        for h in client.collection("users").document(uid).collection("submissionHistory").stream():
            history.append(h.to_dict() or {})
        history.sort(key=lambda d: (as_dt(d.get("updatedAt")) or datetime.min.replace(tzinfo=timezone.utc)))

        export.append({
            "uid": uid,
            "profile": {
                "email": profile.get("email"),
                "displayName": profile.get("displayName"),
                "createdAt": to_iso(profile.get("createdAt")),
                "lastSeenAt": to_iso(profile.get("lastSeenAt")),
            },
            "current": snap_summary(current) if current else None,
            "history": [snap_summary(h) for h in history],
        })

        # Graded = latest snapshot at or before the deadline.
        valid = [h for h in history if (as_dt(h.get("updatedAt")) or DEADLINE) <= DEADLINE]
        late = len(history) - len(valid)
        late_discarded += late
        if not valid:
            if history:
                print(f"  !! {profile.get('displayName') or profile.get('email') or uid}: "
                      f"all {len(history)} saves are past the deadline, no graded entry")
            continue

        g = valid[-1]
        games = g.get("games") or {}
        wins = sum(1 for v in games.values() if v == "W")
        losses = sum(1 for v in games.values() if v == "L")
        graded.append({
            "uid": uid,
            "displayName": g.get("displayName") or profile.get("displayName"),
            "email": g.get("email") or profile.get("email"),
            "version": g.get("version"),
            "updatedAt": to_iso(g.get("updatedAt")),
            "lateSavesDiscarded": late,
            "record": f"{wins}-{losses}",
            "roster": g.get("roster") or [],
            "squad": g.get("squad") or [],
            "games": games,
        })
        if late:
            print(f"  -- {g.get('displayName') or g.get('email') or uid}: "
                  f"discarded {late} late save(s), grading v{g.get('version')} from {to_iso(g.get('updatedAt'))}")

    Path("2026_export.json").write_text(json.dumps(export, indent=2), encoding="utf-8")
    Path("2026_graded.json").write_text(json.dumps(graded, indent=2), encoding="utf-8")

    with Path("2026_graded.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["displayName", "email", "version", "updatedAt", "record", "roster", "squad", "games"])
        for g in graded:
            games_str = ",".join(f"{wk}:{res}" for wk, res in sorted(g["games"].items(), key=lambda kv: int(kv[0])))
            w.writerow([
                g["displayName"], g["email"], g["version"], g["updatedAt"], g["record"],
                " | ".join(g["roster"]), " | ".join(g["squad"]), games_str,
            ])

    print(f"\nUsers exported: {len(export)}")
    print(f"Graded entries: {len(graded)}")
    print(f"Late saves discarded: {late_discarded}")
    print("Wrote 2026_export.json, 2026_graded.json, 2026_graded.csv")


if __name__ == "__main__":
    main()
