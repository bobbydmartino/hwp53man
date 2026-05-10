// 2026/js/data.js
// PLACEHOLDER DATA. Replace `players` with the real 90-man roster when announced
// (typically late July / early August 2026), and replace `schedule` with the
// official 2026 Chargers schedule when the NFL releases it (typically May).

// --- Players (placeholder: copied from 2025 roster) ---
window.HWP_PLAYERS = [
  { name: "Justin Herbert", pos: "QB", number: 10 },
  { name: "Taylor Heinicke", pos: "QB", number: 4 },
  { name: "Trey Lance", pos: "QB", number: 5 },
  { name: "DJ Uiagalelei", pos: "QB", number: 7 },
  { name: "Joe Alt", pos: "T", number: 76 },
  { name: "Mekhi Becton", pos: "G", number: 73 },
  { name: "Trey Pipkins", pos: "T", number: 79 },
  { name: "Zion Johnson", pos: "IOL", number: 77 },
  { name: "Jake Slaughter", pos: "IOL", number: 66 },
  { name: "Bradley Bozeman", pos: "IOL", number: 75 },
  { name: "Jamaree Salyer", pos: "G", number: 68 },
  { name: "Branson Taylor", pos: "G", number: 71 },
  { name: "Karsen Barnhart", pos: "G", number: 61 },
  { name: "Josh Kaltenberger", pos: "C", number: 63 },
  { name: "Ryan Nelson", pos: "T", number: 74 },
  { name: "Nash Jones", pos: "G", number: 62 },
  { name: "Corey Stewart", pos: "T", number: 65 },
  { name: "David Sharpe", pos: "T", number: 64 },
  { name: "Ladd McConkey", pos: "WR", number: 15 },
  { name: "Keenan Allen", pos: "WR", number: 13 },
  { name: "Quentin Johnston", pos: "WR", number: 1 },
  { name: "Derius Davis", pos: "WR", number: 12 },
  { name: "Jalen Reagor", pos: "WR", number: 88 },
  { name: "Tre' Harris", pos: "WR", number: 9 },
  { name: "Keandre Lambert-Smith", pos: "WR", number: 84 },
  { name: "Luke Grimm", pos: "WR", number: 37 },
  { name: "Brendan Rice", pos: "WR", number: 82 },
  { name: "Jaylen Johnson", pos: "WR", number: 39 },
  { name: "Dalevon Campbell", pos: "WR", number: 38 },
  { name: "JaQuae Jackson", pos: "WR", number: 27 },
  { name: "Omarion Hampton", pos: "RB", number: 8 },
  { name: "Najee Harris", pos: "RB", number: 22 },
  { name: "Hassan Haskins", pos: "RB", number: 28 },
  { name: "Kimani Vidal", pos: "RB", number: 30 },
  { name: "Nyheim Miller-Hines", pos: "RB", number: 31 },
  { name: "Raheim Sanders", pos: "RB", number: 35 },
  { name: "Jaret Patterson", pos: "RB", number: 34 },
  { name: "Will Dissly", pos: "TE", number: 89 },
  { name: "Tyler Conklin", pos: "TE", number: 83 },
  { name: "Oronde Gadsden II", pos: "TE", number: 86 },
  { name: "Scott Matlock", pos: "FB/DL", number: 44 },
  { name: "Tucker Fisk", pos: "TE", number: 42 },
  { name: "Stevo Klotz", pos: "TE", number: 41 },
  { name: "Cam Dicker", pos: "K", number: 11 },
  { name: "Josh Harris", pos: "LS", number: 47 },
  { name: "JK Scott", pos: "P", number: 16 },
  { name: "Teair Tart", pos: "DL", number: 90 },
  { name: "Da'Shawn Hand", pos: "DL", number: 91 },
  { name: "Naquon Jones", pos: "DL", number: 96 },
  { name: "Otito Ogbonnia", pos: "DL", number: 93 },
  { name: "Jamaree Caldwell", pos: "DL", number: 99 },
  { name: "Justin Eboigbe", pos: "DL", number: 92 },
  { name: "Christopher Hinton", pos: "DL", number: 98 },
  { name: "TeRah Edwards", pos: "DL", number: 94 },
  { name: "Nesta Jade Silvera", pos: "DL", number: 60 },
  { name: "Khalil Mack", pos: "OLB", number: 52 },
  { name: "Tuli Tuipulotu", pos: "OLB", number: 45 },
  { name: "Bud Dupree", pos: "OLB", number: 48 },
  { name: "Kyle Kennard", pos: "OLB", number: 54 },
  { name: "Caleb Murphy", pos: "OLB", number: 50 },
  { name: "Tre'Mon Morris-Brash", pos: "OLB", number: 57 },
  { name: "Kylan Guidry", pos: "OLB", number: 59 },
  { name: "Garmon Randolph", pos: "OLB", number: 97 },
  { name: "Daiyan Henley", pos: "ILB", number: 0 },
  { name: "Denzel Perryman", pos: "ILB", number: 6 },
  { name: "Troy Dye", pos: "ILB", number: 43 },
  { name: "Junior Colson", pos: "ILB", number: 25 },
  { name: "Del'Shawn Phillips", pos: "ILB", number: 53 },
  { name: "Kana'i Mauga", pos: "ILB", number: 56 },
  { name: "Marlowe Wax", pos: "ILB", number: 58 },
  { name: "Emany Johnson", pos: "ILB", number: 38 },
  { name: "Tarheeb Still", pos: "CB", number: 29 },
  { name: "Cam Hart", pos: "CB", number: 20 },
  { name: "Donte Jackson", pos: "CB", number: 26 },
  { name: "Benjamin St-Juste", pos: "CB", number: 24 },
  { name: "Ja'Sir Taylor", pos: "CB", number: 36 },
  { name: "Deane Leonard", pos: "CB", number: 33 },
  { name: "Nikko Reed", pos: "CB", number: 46 },
  { name: "Eric Rogers", pos: "CB", number: 39 },
  { name: "Trikweze Bridges", pos: "CB", number: 31 },
  { name: "Myles Purchase", pos: "CB", number: 49 },
  { name: "Nehemiah Shelton", pos: "CB", number: 41 },
  { name: "Harrison Hand", pos: "CB", number: 37 },
  { name: "Derwin James", pos: "S", number: 3 },
  { name: "Elijah Molden", pos: "S", number: 2 },
  { name: "Alohi Gilman", pos: "S", number: 32 },
  { name: "RJ Mickens", pos: "S", number: 27 },
  { name: "Tony Jefferson", pos: "S", number: 23 },
  { name: "Kendall Williamson", pos: "S", number: 40 },
  { name: "Jaylen Jones", pos: "S", number: 35 },
  { name: "Austin Deculus", pos: "T", number: "??" },
  { name: "Rick Lovato", pos: "LS", number: "??" }
];

// --- Schedule (placeholder: invented matchups with plausible 2026 Chargers slate) ---
// `home: true` = home game, false = away. `week` is NFL week number.
window.HWP_SCHEDULE = [
  { week: 1,  date: "2026-09-13", opponent: "Las Vegas Raiders",   home: true  },
  { week: 2,  date: "2026-09-20", opponent: "Kansas City Chiefs",  home: false },
  { week: 3,  date: "2026-09-27", opponent: "Denver Broncos",      home: true  },
  { week: 4,  date: "2026-10-04", opponent: "Houston Texans",      home: false },
  { week: 5,  date: "2026-10-11", opponent: "Pittsburgh Steelers", home: true  },
  { week: 6,  date: "2026-10-18", opponent: "Las Vegas Raiders",   home: false },
  // Week 7 BYE
  { week: 8,  date: "2026-11-01", opponent: "Cincinnati Bengals",  home: true  },
  { week: 9,  date: "2026-11-08", opponent: "Cleveland Browns",    home: false },
  { week: 10, date: "2026-11-15", opponent: "Kansas City Chiefs",  home: true  },
  { week: 11, date: "2026-11-22", opponent: "Denver Broncos",      home: false },
  { week: 12, date: "2026-11-29", opponent: "Buffalo Bills",       home: true  },
  { week: 13, date: "2026-12-06", opponent: "Baltimore Ravens",    home: false },
  { week: 14, date: "2026-12-13", opponent: "New York Jets",       home: true  },
  { week: 15, date: "2026-12-20", opponent: "Jacksonville Jaguars",home: false },
  { week: 16, date: "2026-12-25", opponent: "New England Patriots",home: true  },
  { week: 17, date: "2027-01-03", opponent: "Tennessee Titans",    home: false },
  { week: 18, date: "2027-01-10", opponent: "Miami Dolphins",      home: true  }
];

// --- Constants ---
window.HWP_ROSTER_SIZE = 53;
window.HWP_SQUAD_SIZE = 16;
window.HWP_GROUPS = ['QB', 'RB', 'WR', 'TE/FB', 'OL', 'DL', 'OLB', 'ILB', 'CB', 'S', 'ST'];
window.HWP_BUCKET = function (pos) {
  if (['T', 'G', 'C', 'IOL'].includes(pos)) return 'OL';
  if (['K', 'P', 'LS'].includes(pos)) return 'ST';
  if (['TE', 'FB/DL'].includes(pos)) return 'TE/FB';
  return pos;
};
