// 2026/js/data.js
// PLACEHOLDER DATA. Replace `players` with the real 90-man roster when announced
// (typically late July / early August 2026), and replace `schedule` with the
// official 2026 Chargers schedule when the NFL releases it (typically May).

// --- Players (placeholder: copied from 2025 roster) ---
window.HWP_PLAYERS = [
  { name: "Justin Herbert", pos: "QB", number: 10 },
  { name: "Trey Lance", pos: "QB", number: 5 },
  { name: "DJ Uiagalelei", pos: "QB", number: 7 },
  { name: "Joe Alt", pos: "T", number: 76 },
  { name: "Rashawn Slater", pos: "T", number: 70 },
  { name: "Trey Pipkins", pos: "T", number: 79 },
  { name: "Tyler Biadasz", pos: "C", number: 63 },
  { name: "Jake Slaughter", pos: "IOL", number: 66 },
  { name: "Cole Strange", pos: "G", number: 69 },
  { name: "Trevor Penning", pos: "G", number: 75 },
  { name: "Kayode Awosika", pos: "G", number: 74 },
  { name: "Travis Burke", pos: "T", number: 77 },
  { name: "Alex Harkey", pos: "G", number: 73 },
  { name: "Branson Taylor", pos: "G", number: 71 },
  { name: "Logan Taylor", pos: "G", number: 65 },
  { name: "Isaiah World", pos: "T", number: 67 },
  { name: "Josh Kaltenberger", pos: "C", number: 68 },
  { name: "Jacob Spomer", pos: "C", number: 60 },
  { name: "Laekin Vakalahi", pos: "T", number: 78 },
  { name: "Ladd McConkey", pos: "WR", number: 15 },
  { name: "Quentin Johnston", pos: "WR", number: 1 },
  { name: "Tre' Harris", pos: "WR", number: 9 },
  { name: "Derius Davis", pos: "WR", number: 12 },
  { name: "KeAndre Lambert-Smith", pos: "WR", number: 84 },
  { name: "Brenen Thompson", pos: "WR", number: 89 },
  { name: "Luke Grimm", pos: "WR", number: 87 },
  { name: "Dalevon Campbell", pos: "WR", number: 81 },
  { name: "JaQuae Jackson", pos: "WR", number: 82 },
  { name: "Devonte Ross", pos: "WR", number: 24 },
  { name: "Sincere Brown", pos: "WR", number: 38 },
  { name: "Omarion Hampton", pos: "RB", number: 8 },
  { name: "Keaton Mitchell", pos: "RB", number: 34 },
  { name: "Kimani Vidal", pos: "RB", number: 28 },
  { name: "Jaret Patterson", pos: "RB", number: 32 },
  { name: "Amar Johnson", pos: "RB", number: 35 },
  { name: "Gregory Desrosiers", pos: "RB", number: 31 },
  { name: "Oronde Gadsden II", pos: "TE", number: 86 },
  { name: "Charlie Kolar", pos: "TE", number: 88 },
  { name: "David Njoku", pos: "TE", number: 83 },
  { name: "Alec Ingold", pos: "FB", number: 30 },
  { name: "Scott Matlock", pos: "FB/DL", number: 44 },
  { name: "Johnny Pascuzzi", pos: "TE", number: 48 },
  { name: "Evan Svoboda", pos: "TE", number: 49 },
  { name: "Jerand Bradley", pos: "TE", number: 36 },
  { name: "Cam Dicker", pos: "K", number: 11 },
  { name: "Josh Harris", pos: "LS", number: 47 },
  { name: "Peter Bowden", pos: "LS", number: 59 },
  { name: "JK Scott", pos: "P", number: 16 },
  { name: "Teair Tart", pos: "DL", number: 90 },
  { name: "Jamaree Caldwell", pos: "DL", number: 99 },
  { name: "Justin Eboigbe", pos: "DL", number: 92 },
  { name: "Dalvin Tomlinson", pos: "DL", number: 94 },
  { name: "Nick Barrett", pos: "DL", number: 91 },
  { name: "TeRah Edwards", pos: "DL", number: 94 },
  { name: "Jahmeer Carter", pos: "DL", number: 61 },
  { name: "Jacobian Guillory", pos: "DL", number: 95 },
  { name: "Terry Webb", pos: "DL", number: 64 },
  { name: "Khalil Mack", pos: "OLB", number: 52 },
  { name: "Tuli Tuipulotu", pos: "OLB", number: 45 },
  { name: "Akheem Mesidor", pos: "OLB", number: 90 },
  { name: "Bud Dupree", pos: "OLB", number: 48 },
  { name: "Kyle Kennard", pos: "OLB", number: 54 },
  { name: "Nadame Tucker", pos: "OLB", number: 56 },
  { name: "Garmon Randolph", pos: "OLB", number: 97 },
  { name: "Andre Carter", pos: "OLB", number: 51 },
  { name: "Daiyan Henley", pos: "ILB", number: 0 },
  { name: "Denzel Perryman", pos: "ILB", number: 6 },
  { name: "Troy Dye", pos: "ILB", number: 43 },
  { name: "Junior Colson", pos: "ILB", number: 25 },
  { name: "Del'Shawn Phillips", pos: "ILB", number: 53 },
  { name: "Marlowe Wax", pos: "ILB", number: 58 },
  { name: "Emany Johnson", pos: "ILB", number: 50 },
  { name: "Lander Barton", pos: "ILB", number: 57 },
  { name: "Tarheeb Still", pos: "CB", number: 29 },
  { name: "Cam Hart", pos: "CB", number: 20 },
  { name: "Donte Jackson", pos: "CB", number: 26 },
  { name: "Deane Leonard", pos: "CB", number: 33 },
  { name: "Nikko Reed", pos: "CB", number: 46 },
  { name: "Eric Rogers", pos: "CB", number: 39 },
  { name: "Isas Waxter", pos: "CB", number: 37 },
  { name: "Rodney Shelley", pos: "CB", number: 24 },
  { name: "Avery Smith", pos: "CB", number: 36 },
  { name: "Myles Purchase", pos: "CB", number: 49 },
  { name: "Derwin James", pos: "S", number: 3 },
  { name: "Elijah Molden", pos: "S", number: 2 },
  { name: "RJ Mickens", pos: "S", number: 27 },
  { name: "Tony Jefferson", pos: "S", number: 23 },
  { name: "Genesis Smith", pos: "S", number: 22 },
  { name: "Kendall Williamson", pos: "S", number: 40 },
  { name: "Devin Grant", pos: "S", number: 38 },
  { name: "Noah Avinger", pos: "S", number: 31 },
];

// --- Schedule (placeholder: invented matchups with plausible 2026 Chargers slate) ---
// `home: true` = home game, false = away. `week` is NFL week number.
window.HWP_SCHEDULE = [
  { week: 1,  date: "2026-09-13", opponent: "Arizona Cardinals",   home: true  },
  { week: 2,  date: "2026-09-20", opponent: "Las Vegas Raiders",   home: true  },
  { week: 3,  date: "2026-09-27", opponent: "Buffalo Bills",       home: false },
  { week: 4,  date: "2026-10-04", opponent: "Seattle Seahawks",    home: false },
  { week: 5,  date: "2026-10-11", opponent: "Denver Broncos",      home: true  },
  { week: 6,  date: "2026-10-18", opponent: "Kansas City Chiefs",  home: false },
  // Week 7 BYE
  { week: 8,  date: "2026-11-01", opponent: "Los Angeles Rams",    home: false },
  { week: 9,  date: "2026-11-08", opponent: "Houston Texans",      home: true  },
  { week: 10, date: "2026-11-16", opponent: "Baltimore Ravens",    home: false },
  { week: 11, date: "2026-11-22", opponent: "New York Jets",       home: true  },
  { week: 12, date: "2026-11-29", opponent: "New England Patriots", home: true },
  { week: 13, date: "2026-12-06", opponent: "Tampa Bay Buccaneers", home: false },
  { week: 14, date: "2026-12-13", opponent: "Las Vegas Raiders",   home: false  },
  { week: 15, date: "2026-12-17", opponent: "San Francisco 49ers",home: true },
  { week: 16, date: "2026-12-27", opponent: "Miami Dolphins",      home: false  },
  { week: 17, date: "2027-01-03", opponent: "Kansas City Chiefs",  home: true },
  { week: 18, date: "2027-01-10", opponent: "Denver Broncos",      home: false  }
];

// --- Constants ---
window.HWP_ROSTER_SIZE = 53;
window.HWP_SQUAD_SIZE = 16;
window.HWP_GROUPS = ['QB', 'RB', 'WR', 'TE/FB', 'FB', 'OL', 'DL', 'OLB', 'ILB', 'CB', 'S', 'ST'];
window.HWP_BUCKET = function (pos) {
  if (['T', 'G', 'C', 'IOL'].includes(pos)) return 'OL';
  if (['K', 'P', 'LS'].includes(pos)) return 'ST';
  if (['TE', 'FB/DL', 'FB'].includes(pos)) return 'TE/FB';
  return pos;
};
