# puller_min.py
# Export Firestore 'submissions' to submissions.csv with columns:
#   date,name,roster,squad
# roster/squad are lists of strings, joined with " | "

from google.cloud import firestore
from google.oauth2 import service_account
from pathlib import Path
import csv
from datetime import timezone

PROJECT_ID = "hwp53man-7e6ab"
SERVICE_ACCOUNT_PATH = Path("serviceAccount.json")  # Put your key here (exact filename)

COLLECTION = "submissions"
FIELD_DATE = "date"
FIELD_NAME = "name"
FIELD_ROSTER = "roster"
FIELD_SQUAD = "squad"

def to_iso(val) -> str:
    if val is None:
        return ""
    # Firestore Timestamp has .isoformat() in client lib; if it's datetime-like, use isoformat.
    try:
        # google.cloud.firestore_v1._helpers.DatetimeWithNanoseconds
        if getattr(val, "tzinfo", None) is None:
            return val.replace(tzinfo=timezone.utc).isoformat()
        return val.isoformat()
    except Exception:
        pass
    # As string or fallback
    return str(val)

def join_list(items) -> str:
    if not items:
        return ""
    if isinstance(items, (list, tuple)):
        return " | ".join(str(x) for x in items)
    return str(items)

def main():
    if not SERVICE_ACCOUNT_PATH.is_file():
        raise SystemExit(
            f"serviceAccount.json not found at {SERVICE_ACCOUNT_PATH.resolve()}\n"
            "Download a Firebase service account key JSON and save it with this exact name."
        )

    creds = service_account.Credentials.from_service_account_file(str(SERVICE_ACCOUNT_PATH))
    client = firestore.Client(project=PROJECT_ID, credentials=creds)

    docs = list(client.collection(COLLECTION).stream())
    if not docs:
        print("No documents found in 'submissions'. Writing empty CSV.")
    out = Path("submissions.csv")
    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["date", "name", "roster", "squad"])
        for d in docs:
            data = d.to_dict() or {}
            date_val = to_iso(data.get(FIELD_DATE))
            name_val = data.get(FIELD_NAME, "")
            roster_val = data.get(FIELD_ROSTER) or []
            squad_val = data.get(FIELD_SQUAD) or []
            # Coerce to lists of strings
            if not isinstance(roster_val, (list, tuple)): roster_val = [str(roster_val)]
            else: roster_val = [str(x) for x in roster_val]
            if not isinstance(squad_val, (list, tuple)): squad_val = [str(squad_val)]
            else: squad_val = [str(x) for x in squad_val]

            w.writerow([date_val, str(name_val), join_list(roster_val), join_list(squad_val)])

    print(f"Wrote {len(docs)} rows to {out.resolve()}")

if __name__ == "__main__":
    main()
