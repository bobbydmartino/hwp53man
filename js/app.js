// js/app.js

// --- Firebase Configuration ---
// This remains the same as your original file
const firebaseConfig = window.firebaseConfig;

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- Data & State ---
// Unchanged from original
const players = [
      { name: "Justin Herbert", pos: "QB", number: 10 },
      { name: "Taylor Heinicke", pos: "QB", number: 4 },
      { name: "Trey Lance", pos: "QB", number: 5 },
      { name: "DJ Uiagalelei", pos: "QB", number: 7 },
      { name: "Rashawn Slater", pos: "T", number: 70 },
      { name: "Joe Alt", pos: "T", number: 76 },
      { name: "Mekhi Becton", pos: "G", number: 73 },
      { name: "Trey Pipkins", pos: "T", number: 79 },
      { name: "Zion Johnson", pos: "IOL", number: 77 },
      { name: "Andre James", pos: "IOL", number: 78 },
      { name: "Bradley Bozeman", pos: "IOL", number: 75 },
      { name: "Jamaree Salyer", pos: "G", number: 68 },
      { name: "Branson Taylor", pos: "G", number: 71 },
      { name: "Karsen Barnhart", pos: "G", number: 61 },
      { name: "Josh Kaltenberger", pos: "C", number: 63 },
      { name: "Ryan Nelson", pos: "T", number: 74 },
      { name: "Nash Jones", pos: "G", number: 62 },
      { name: "Corey Stewart", pos: "T", number: 65 },
      { name: "Ladd McConkey", pos: "WR", number: 15 },
      { name: "Keenan Allen", pos: "WR", number: 13 },
      { name: "Quentin Johnston", pos: "WR", number: 1 },
      { name: "Derius Davis", pos: "WR", number: 12 },
      { name: "Jalen Reagor", pos: "WR", number: 88 },
      { name: "Tre' Harris", pos: "WR", number: 9 },
      { name: "Keandre Lambert-Smith", pos: "WR", number: 84 },
      { name: "Luke Grimm", pos: "WR", number: 37 },
      { name: "Brendan Rice", pos: "WR", number: 82 },
      { name: "Dez Fitzpatrick", pos: "WR", number: 87 },
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
      { name: "Trikweze Bridges", pos: "CB", number: 31 },
      { name: "Myles Purchase", pos: "CB", number: 49 },
      { name: "Jordan Oladokun", pos: "CB", number: 37 },
      { name: "Eric Rogers", pos: "CB", number: 39 },
      { name: "Derwin James", pos: "S", number: 3 },
      { name: "Elijah Molden", pos: "S", number: 2 },
      { name: "Alohi Gilman", pos: "S", number: 3 },
      { name: "RJ Mickens", pos: "S", number: 27 },
      { name: "Tony Jefferson", pos: "S", number: 23 },
      { name: "Kendall Williamson", pos: "S", number: 40 },
      { name: "Jaylen Jones", pos: "S", number: 35 }
    ];
const groups = ['QB', 'RB', 'WR', 'TE/FB', 'OL', 'DL', 'OLB', 'ILB', 'CB', 'S', 'ST'];
const bucket = (pos) => {
    if (['T', 'G', 'C', 'IOL'].includes(pos)) return 'OL';
    if (['K', 'P', 'LS'].includes(pos)) return 'ST';
    if (['TE','FB/DL'].includes(pos)) return 'TE/FB';
    return pos;
};

// Application state
let picked = {
    roster: [],
    squad: []
};

// --- DOM Elements ---
const homeView = document.getElementById('home-view');
const selectionView = document.getElementById('selection-view');
const statsView = document.getElementById('stats-view');
const playerSelectionArea = document.getElementById('player-selection-area');
const positionNav = document.getElementById('position-nav');
const rosterCountEl = document.getElementById('rosterCount');
const squadCountEl = document.getElementById('squadCount');
const submitBtn = document.getElementById('submitBtn');
const nameInput = document.getElementById('nameInput');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderAll();
    
    // Event listeners
    document.getElementById('start-button').addEventListener('click', () => {
        homeView.classList.add('d-none');
        selectionView.classList.remove('d-none');
    });

    submitBtn.addEventListener('click', submitPicks);

    document.getElementById('backBtn').addEventListener('click', () => {
        // Reset state and UI to allow for new picks
        picked = { roster: [], squad: [] };
        nameInput.value = '';
        renderAll(); // Re-render the selection UI
        statsView.classList.add('d-none');
        selectionView.classList.remove('d-none');
        window.location.hash = ''; // Clear hash
    });
    
    // Handle deep link to stats
    if (window.location.hash === '#stats') {
        showStats();
    }
});


// --- Rendering Functions ---

function renderAll() {
    renderPositionNav();
    renderPlayerCards();
    updateCountsAndSubmitState();
}

function renderPositionNav() {
    positionNav.innerHTML = '';
    // Add Rules link first
    positionNav.innerHTML += `
        <a class="nav-link" href="#rules-section">Rules</a>
    `;
    groups.forEach(group => {
        const groupPlayers = players.filter(p => bucket(p.pos) === group);
        const selectedCount = picked.roster.filter(i => bucket(players[i].pos) === group).length;
        
        const link = document.createElement('a');
        link.className = 'nav-link';
        link.href = `#group-${group}`;
        link.textContent = `${group} (${selectedCount})`;
        link.dataset.group = group;
        positionNav.appendChild(link);
    });
}

function renderPlayerCards() {
    // Group players by bucket
    const playersByGroup = {};
    groups.forEach(g => playersByGroup[g] = []);
    players.forEach((player, index) => {
        playersByGroup[bucket(player.pos)].push({ ...player, index });
    });

    // Clear existing content except for rules
    const rulesSection = document.getElementById('rules-section');
    playerSelectionArea.innerHTML = '';
    playerSelectionArea.appendChild(rulesSection);
    
    // Create sections for each group
    for (const group of groups) {
        const groupPlayers = playersByGroup[group];
        if (groupPlayers.length === 0) continue;

        const section = document.createElement('section');
        section.id = `group-${group}`;
        section.className = 'mb-5';

        section.innerHTML = `
            <h3 class="position-group-title">${group}</h3>
            <div class="player-grid">
                ${groupPlayers.map(p => createPlayerCardHTML(p)).join('')}
            </div>
        `;
        playerSelectionArea.appendChild(section);
    }
    
    // Add event listeners to the new cards
    document.querySelectorAll('.player-card').forEach(card => {
        card.addEventListener('click', handlePlayerClick);
    });

    // Update the visual state of all cards
    updateCardSelectionState();
}

function createPlayerCardHTML(player) {
    return `
        <div class="player-card" data-player-index="${player.index}">
            <div class="player-name">${player.name}</div>
            <div class="player-info">#${player.number} &middot; ${player.pos}</div>
        </div>
    `;
}

// --- State Update Functions ---

function updateCountsAndSubmitState() {
    rosterCountEl.textContent = picked.roster.length;
    squadCountEl.textContent = picked.squad.length;

    const isComplete = picked.roster.length === 53 && picked.squad.length === 16;
    const hasName = nameInput.value.trim() !== '';
    
    submitBtn.disabled = !isComplete || !hasName;
    nameInput.addEventListener('input', () => { // Re-check on name input
        submitBtn.disabled = !isComplete || nameInput.value.trim() === '';
    });

    // Update counts in the nav
    renderPositionNav();
}

function updateCardSelectionState() {
    const allCards = document.querySelectorAll('.player-card');
    allCards.forEach(card => {
        const index = parseInt(card.dataset.playerIndex);
        card.classList.remove('selected-roster', 'selected-squad');
        
        if (picked.roster.includes(index)) {
            card.classList.add('selected-roster');
        } else if (picked.squad.includes(index)) {
            card.classList.add('selected-squad');
        }
    });
}


// --- Event Handlers ---

function handlePlayerClick(event) {
    const card = event.currentTarget;
    const index = parseInt(card.dataset.playerIndex);

    const isRoster = picked.roster.includes(index);
    const isSquad = picked.squad.includes(index);

    if (isRoster) {
        // Deselect from roster
        picked.roster = picked.roster.filter(i => i !== index);
    } else if (isSquad) {
        // Deselect from squad
        picked.squad = picked.squad.filter(i => i !== index);
    } else {
        // Select player
        if (picked.roster.length < 53) {
            picked.roster.push(index);
        } else if (picked.squad.length < 16) {
            picked.squad.push(index);
        } else {
            // Both are full, maybe give a subtle feedback
            card.animate([
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 200, iterations: 2 });
            return; // Don't update UI if no change
        }
    }

    // Efficiently update UI
    updateCountsAndSubmitState();
    updateCardSelectionState();
}

// --- Backend and Stats Logic ---

function submitPicks() {
    const name = nameInput.value.trim();
    if (!name) return alert('Enter your name or handle');
    if (picked.roster.length !== 53 || picked.squad.length !== 16)
        return alert('Must pick exactly 53 for the roster & 16 for the practice squad.');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const data = {
        name,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        roster: picked.roster.map(i => players[i].name),
        squad: picked.squad.map(i => players[i].name)
    };
    
    db.collection('submissions').add(data)
      .then(() => {
          showStats();
      })
      .catch(e => {
          console.error(e);
          alert('An error occurred while submitting. Please try again.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
      });
}

function showStats() {
    homeView.classList.add('d-none');
    selectionView.classList.add('d-none');
    statsView.classList.remove('d-none');
    window.location.hash = '#stats';
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    loadAndRenderStats();
}

async function loadAndRenderStats() {
    const statsContent = document.getElementById('stats-content');
    statsContent.innerHTML = '<p class="text-center">Loading stats...</p>';

    try {
        const snap = await db.collection('submissions').get();
        const submissions = snap.docs.map(doc => doc.data());
        const total = submissions.length;

        if (total === 0) {
            statsContent.innerHTML = '<p class="text-center">No submissions yet. Be the first!</p>';
            return;
        }

        // Calculate player counts
        const rosterCount = {};
        const squadCount = {};
        players.forEach(p => {
            rosterCount[p.name] = 0;
            squadCount[p.name] = 0;
        });
        submissions.forEach(({ roster, squad }) => {
            roster.forEach(n => rosterCount[n]++);
            squad.forEach(n => squadCount[n]++);
        });

        // Calculate average picks per position group
        const groupSums = {};
        groups.forEach(g => groupSums[g] = 0);
        const nameToBucket = players.reduce((map, p) => {
            map[p.name] = bucket(p.pos);
            return map;
        }, {});
        submissions.forEach(sub => {
            const counts = {};
            groups.forEach(g => counts[g] = 0);
            sub.roster.forEach(name => {
                const g = nameToBucket[name];
                if (g) counts[g]++;
            });
            groups.forEach(g => groupSums[g] += counts[g]);
        });

        // --- Render Stats Tables ---
        statsContent.innerHTML = '';
        groups.forEach(group => {
            const groupPlayers = players.filter(p => bucket(p.pos) === group);
            if (groupPlayers.length === 0) return;

            const avg = (groupSums[group] / total).toFixed(1);
            
            const tableHTML = `
                <div class="stats-table">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th colspan="5" class="position-header">
                                    ${group} 
                                    <span class="avg-count float-end">Avg. Roster Spots: ${avg}</span>
                                </th>
                            </tr>
                            <tr>
                                <th>Player</th>
                                <th class="text-center">#</th>
                                <th class="text-center">% Rostered</th>
                                <th class="text-center">% P. Squad</th>
                                <th class="text-center">% Not Picked</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${groupPlayers.map(p => {
                                const rPct = (rosterCount[p.name] / total * 100);
                                const sPct = (squadCount[p.name] / total * 100);
                                const nPct = 100 - rPct - sPct;
                                return `
                                    <tr>
                                        <td>${p.name}</td>
                                        <td class="text-center">${p.number}</td>
                                        <td class="text-center">${rPct.toFixed(1)}%</td>
                                        <td class="text-center">${sPct.toFixed(1)}%</td>
                                        <td class="text-center">${nPct.toFixed(1)}%</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            statsContent.innerHTML += tableHTML;
        });

    } catch (error) {
        console.error("Error loading stats:", error);
        statsContent.innerHTML = '<p class="text-center text-danger">Could not load stats. Please try again later.</p>';
    }
}
