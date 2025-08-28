# convert_submissions.py
# 1) Paste your full players list into `data` below.
# 2) Put submissions.csv next to this file. It can use any header case:
#    date/name/roster/squad or Date/Name/Roster/Squad, etc.
# 3) Run: uv run convert_submissions.py
# 4) Output: editedsubmissions.csv

import csv
import sys
import unicodedata
import re
from typing import Dict, List

# ==== PASTE YOUR LIST HERE ====
data = [ { "name": "Justin Herbert", "pos": "QB", "number": 10 }, { "name": "Taylor Heinicke", "pos": "QB", "number": 4 }, { "name": "Trey Lance", "pos": "QB", "number": 5 }, { "name": "DJ Uiagalelei", "pos": "QB", "number": 7 }, { "name": "Joe Alt", "pos": "T", "number": 76 }, { "name": "Mekhi Becton", "pos": "G", "number": 73 }, { "name": "Trey Pipkins", "pos": "T", "number": 79 }, { "name": "Zion Johnson", "pos": "IOL", "number": 77 }, { "name": "Andre James", "pos": "IOL", "number": 78 }, { "name": "Bradley Bozeman", "pos": "IOL", "number": 75 }, { "name": "Jamaree Salyer", "pos": "G", "number": 68 }, { "name": "Branson Taylor", "pos": "G", "number": 71 }, { "name": "Karsen Barnhart", "pos": "G", "number": 61 }, { "name": "Josh Kaltenberger", "pos": "C", "number": 63 }, { "name": "Ryan Nelson", "pos": "T", "number": 74 }, { "name": "Nash Jones", "pos": "G", "number": 62 }, { "name": "Corey Stewart", "pos": "T", "number": 65 }, { "name": "David Sharpe", "pos": "T", "number": 64 }, { "name": "Ladd McConkey", "pos": "WR", "number": 15 }, { "name": "Keenan Allen", "pos": "WR", "number": 13 }, { "name": "Quentin Johnston", "pos": "WR", "number": 1 }, { "name": "Derius Davis", "pos": "WR", "number": 12 }, { "name": "Jalen Reagor", "pos": "WR", "number": 88 }, { "name": "Tre' Harris", "pos": "WR", "number": 9 }, { "name": "Keandre Lambert-Smith", "pos": "WR", "number": 84 }, { "name": "Luke Grimm", "pos": "WR", "number": 37 }, { "name": "Brendan Rice", "pos": "WR", "number": 82 }, { "name": "Jaylen Johnson", "pos": "WR", "number": 39 }, { "name": "Dalevon Campbell", "pos": "WR", "number": 38 }, { "name": "JaQuae Jackson", "pos": "WR", "number": 27 }, { "name": "Omarion Hampton", "pos": "RB", "number": 8 }, { "name": "Najee Harris", "pos": "RB", "number": 22 }, { "name": "Hassan Haskins", "pos": "RB", "number": 28 }, { "name": "Kimani Vidal", "pos": "RB", "number": 30 }, { "name": "Nyheim Miller-Hines", "pos": "RB", "number": 31 }, { "name": "Raheim Sanders", "pos": "RB", "number": 35 }, { "name": "Jaret Patterson", "pos": "RB", "number": 34 }, { "name": "Will Dissly", "pos": "TE", "number": 89 }, { "name": "Tyler Conklin", "pos": "TE", "number": 83 }, { "name": "Oronde Gadsden II", "pos": "TE", "number": 86 }, { "name": "Scott Matlock", "pos": "FB/DL", "number": 44 }, { "name": "Tucker Fisk", "pos": "TE", "number": 42 }, { "name": "Stevo Klotz", "pos": "TE", "number": 41 }, { "name": "Cam Dicker", "pos": "K", "number": 11 }, { "name": "Josh Harris", "pos": "LS", "number": 47 }, { "name": "JK Scott", "pos": "P", "number": 16 }, { "name": "Teair Tart", "pos": "DL", "number": 90 }, { "name": "Da'Shawn Hand", "pos": "DL", "number": 91 }, { "name": "Naquon Jones", "pos": "DL", "number": 96 }, { "name": "Otito Ogbonnia", "pos": "DL", "number": 93 }, { "name": "Jamaree Caldwell", "pos": "DL", "number": 99 }, { "name": "Justin Eboigbe", "pos": "DL", "number": 92 }, { "name": "Christopher Hinton", "pos": "DL", "number": 98 }, { "name": "TeRah Edwards", "pos": "DL", "number": 94 }, { "name": "Nesta Jade Silvera", "pos": "DL", "number": 60 }, { "name": "Khalil Mack", "pos": "OLB", "number": 52 }, { "name": "Tuli Tuipulotu", "pos": "OLB", "number": 45 }, { "name": "Bud Dupree", "pos": "OLB", "number": 48 }, { "name": "Kyle Kennard", "pos": "OLB", "number": 54 }, { "name": "Caleb Murphy", "pos": "OLB", "number": 50 }, { "name": "Tre'Mon Morris-Brash", "pos": "OLB", "number": 57 }, { "name": "Kylan Guidry", "pos": "OLB", "number": 59 }, { "name": "Garmon Randolph", "pos": "OLB", "number": 97 }, { "name": "Daiyan Henley", "pos": "ILB", "number": 0 }, { "name": "Denzel Perryman", "pos": "ILB", "number": 6 }, { "name": "Troy Dye", "pos": "ILB", "number": 43 }, { "name": "Junior Colson", "pos": "ILB", "number": 25 }, { "name": "Del'Shawn Phillips", "pos": "ILB", "number": 53 }, { "name": "Kana'i Mauga", "pos": "ILB", "number": 56 }, { "name": "Marlowe Wax", "pos": "ILB", "number": 58 }, { "name": "Emany Johnson", "pos": "ILB", "number": 38 }, { "name": "Tarheeb Still", "pos": "CB", "number": 29 }, { "name": "Cam Hart", "pos": "CB", "number": 20 }, { "name": "Donte Jackson", "pos": "CB", "number": 26 }, { "name": "Benjamin St-Juste", "pos": "CB", "number": 24 }, { "name": "Ja'Sir Taylor", "pos": "CB", "number": 36 }, { "name": "Deane Leonard", "pos": "CB", "number": 33 }, { "name": "Nikko Reed", "pos": "CB", "number": 46 }, { "name": "Eric Rogers", "pos": "CB", "number": 39 }, { "name": "Trikweze Bridges", "pos": "CB", "number": 31 }, { "name": "Myles Purchase", "pos": "CB", "number": 49 }, { "name": "Nehemiah Shelton", "pos": "CB", "number": 41 }, { "name": "Harrison Hand", "pos": "CB", "number": 37 }, { "name": "Derwin James", "pos": "S", "number": 3 }, { "name": "Elijah Molden", "pos": "S", "number": 2 }, { "name": "Alohi Gilman", "pos": "S", "number": 32 }, { "name": "RJ Mickens", "pos": "S", "number": 27 }, { "name": "Tony Jefferson", "pos": "S", "number": 23 }, { "name": "Kendall Williamson", "pos": "S", "number": 40 }, { "name": "Jaylen Jones", "pos": "S", "number": 35 } ]
# ==============================

IN_CSV = "submissions.csv"
OUT_CSV = "editedsubmissions.csv"
DELIM = "|"  # Roster/Squad delimiter in your CSV

# -------- Helpers --------
def norm_name(s: str) -> str:
    """Normalize player names for matching."""
    if s is None:
        return ""
    s = unicodedata.normalize("NFKC", s)
    s = (s.replace("’", "'").replace("‘", "'")
           .replace("“", '"').replace("”", '"')
           .replace("—", "-").replace("–", "-"))
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s

def norm_header(s: str) -> str:
    """Normalize header names for case/space-insensitive lookup."""
    return re.sub(r"\s+", "", (s or "").strip().lower())

def find_field(fieldnames: List[str], wanted: str) -> str:
    """Find a column in fieldnames that matches wanted (case/space-insensitive)."""
    wanted_norm = norm_header(wanted)
    for f in fieldnames or []:
        if norm_header(f) == wanted_norm:
            return f
    return ""

# -------- Extract ordered player names --------
try:
    players_order = [str(p["name"]) for p in data]
except Exception:
    print("Error: Paste your players list into the 'data' variable (list of dicts with 'name').", file=sys.stderr)
    sys.exit(1)

players_norm = [norm_name(n) for n in players_order]

# -------- Read input CSV (case-insensitive headers) --------
try:
    with open(IN_CSV, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            print("Error: No headers found in submissions.csv.", file=sys.stderr)
            sys.exit(1)

        date_col  = find_field(reader.fieldnames, "date")
        name_col  = find_field(reader.fieldnames, "name")
        rost_col  = find_field(reader.fieldnames, "roster")
        squad_col = find_field(reader.fieldnames, "squad")

        missing = [label for label, col in [
            ("Date", date_col), ("Name", name_col), ("Roster", rost_col), ("Squad", squad_col)
        ] if not col]

        if missing:
            print(f"Error: Missing columns {missing}. Found: {reader.fieldnames}", file=sys.stderr)
            sys.exit(1)

        rows = list(reader)
except FileNotFoundError:
    print(f"Error: Input file not found: {IN_CSV}", file=sys.stderr)
    sys.exit(1)

# -------- Convert to wide CSV --------
with open(OUT_CSV, "w", encoding="utf-8", newline="") as f_out:
    w = csv.writer(f_out, lineterminator="\n")
    # Use Title Case for the first two columns in the output
    w.writerow(["Date", "Name"] + players_order)

    unknown: Dict[str, int] = {}

    for r in rows:
        date_val = r.get(date_col, "")
        submitter = r.get(name_col, "")

        roster = [s.strip() for s in (r.get(rost_col, "")  or "").split(DELIM) if s.strip()]
        squad  = [s.strip() for s in (r.get(squad_col, "") or "").split(DELIM) if s.strip()]

        # Roster wins if a name appears in both.
        pick_map: Dict[str, str] = {norm_name(n): "0" for n in squad}
        for n in roster:
            pick_map[norm_name(n)] = "1"

        for n in roster + squad:
            if norm_name(n) not in players_norm:
                unknown[n] = unknown.get(n, 0) + 1

        out_row = [date_val, submitter]
        for p_norm in players_norm:
            out_row.append(pick_map.get(p_norm, "-1"))
        w.writerow(out_row)

# -------- Heads-up for mismatches --------
if unknown:
    print("\nNote: Names in CSV not found in your players list (after normalization):", file=sys.stderr)
    for name, count in sorted(unknown.items(), key=lambda x: (-x[1], x[0].lower())):
        print(f"  - {name} (seen {count}x)", file=sys.stderr)

print(f"Wrote {OUT_CSV}")
