// 2026/js/app.js
// Single-column position-grouped picker. Picked players sit at top of each
// position group. + adds (auto-routes to roster, falls back to squad).
// - removes. Badge [R]/[PS] toggles roster<->squad.
// Submission is versioned: current doc is overwritten, history is append-only.
// Big sticky bottom action bar; primary next-step button flashes on completion.

(function () {
  const players  = window.HWP_PLAYERS;
  const schedule = window.HWP_SCHEDULE;
  const groups   = window.HWP_GROUPS;
  const bucket   = window.HWP_BUCKET;
  const ROSTER_SIZE = window.HWP_ROSTER_SIZE;
  const SQUAD_SIZE  = window.HWP_SQUAD_SIZE;
  const GAMES_TOTAL = schedule.length;

  // --- State ---
  let currentUser = null;
  let existingVersion = 0;
  let picked = { roster: [], squad: [], games: {} };
  let missingPlayers = { roster: [], squad: [] };
  let lastCompleteRoster = false;
  let lastCompleteAll = false;

  // --- DOM ---
  const $ = (id) => document.getElementById(id);
  const homeView       = $('home-view');
  const selectionView  = $('selection-view');
  const scheduleView   = $('schedule-view');
  const submittedView  = $('submitted-view');
  const playerSelectionArea = $('player-selection-area');
  const positionNav    = $('position-nav');
  const selectionActionBar = $('selectionActionBar');
  const scheduleActionBar  = $('scheduleActionBar');
  const actionPredictSchedule = $('actionPredictSchedule');
  const actionBackToRoster = $('actionBackToRoster');
  const actionSubmit  = $('actionSubmit');
  const actionSubmit2 = $('actionSubmit2');
  const editAgainBtn  = $('editAgainBtn');
  const btnStart      = $('btn-start');
  const homeButtons   = ['btn-home-selection', 'btn-home-schedule', 'btn-home-submitted'].map($).filter(Boolean);
  const priorStatusEl = $('prior-submission-status');
  const homeVersionEl = $('home-version');
  const submittedVersionEl = $('submittedVersion');
  const teamModalBody  = $('teamModalBody');
  const teamModalVersion = $('teamModalVersion');
  const scheduleStack  = $('schedule-stack');
  const counterEls = {
    roster: [$('rosterCount'), $('rosterCount2')].filter(Boolean),
    squad:  [$('squadCount'),  $('squadCount2')].filter(Boolean),
    games:  [$('gamesCount'),  $('gamesCount2')].filter(Boolean)
  };

  // --- View switching ---
  function showView(name) {
    [homeView, selectionView, scheduleView, submittedView].forEach(v => v && v.classList.add('d-none'));
    [selectionActionBar, scheduleActionBar].forEach(b => b && b.classList.add('d-none'));
    const map = { home: homeView, selection: selectionView, schedule: scheduleView, submitted: submittedView };
    if (map[name]) map[name].classList.remove('d-none');
    if (name === 'selection' && selectionActionBar) selectionActionBar.classList.remove('d-none');
    if (name === 'schedule'  && scheduleActionBar)  scheduleActionBar.classList.remove('d-none');
    window.scrollTo(0, 0);
  }

  // --- Helpers ---
  function pickedRole(idx) {
    if (picked.roster.includes(idx)) return 'R';
    if (picked.squad.includes(idx))  return 'PS';
    return null;
  }
  function submitButtonLabel() {
    return existingVersion > 0 ? `Update (v${existingVersion + 1})` : 'Submit';
  }
  function flash(el) {
    if (!el) return;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }

  // --- Picker rendering ---
  function renderPositionNav() {
    if (!positionNav) return;
    positionNav.innerHTML = '';
    groups.forEach(group => {
      const r = picked.roster.filter(i => bucket(players[i].pos) === group).length;
      const s = picked.squad.filter(i => bucket(players[i].pos) === group).length;
      const link = document.createElement('a');
      link.className = 'nav-link';
      link.href = `#group-${group}`;
      link.textContent = `${group} (${r + s})`;
      positionNav.appendChild(link);
    });
  }

  function rowHTML(player, role) {
    const num = `<span class="player-num">#${player.number}</span>`;
    const name = `<span class="player-name">${player.name}</span>`;
    const posTag = `<span class="player-pos-tag">${player.pos}</span>`;

    const cls = role === 'R' ? ' is-roster' : role === 'PS' ? ' is-squad' : '';
    const rTitle = role === 'R' ? 'Remove from roster' : 'Add to roster';
    const sTitle = role === 'PS' ? 'Remove from practice squad' : 'Move to practice squad';
    return `
      <div class="player-row${cls}" data-player-index="${player.index}">
        <div class="row-actions">
          <button type="button" class="btn-pick roster${role === 'R' ? ' active' : ''}" data-action="roster" title="${rTitle}">Roster</button>
          <button type="button" class="btn-pick squad${role === 'PS' ? ' active' : ''}" data-action="squad" title="${sTitle}">Practice Squad</button>
        </div>
        <div class="row-info">${num} ${name} ${posTag}</div>
      </div>
    `;
  }

  function renderPositionGroups() {
    const playersByGroup = {};
    groups.forEach(g => playersByGroup[g] = []);
    players.forEach((p, index) => playersByGroup[bucket(p.pos)].push({ ...p, index }));

    const rulesSection = document.getElementById('rules-section');
    playerSelectionArea.innerHTML = '';
    if (rulesSection) playerSelectionArea.appendChild(rulesSection);

    for (const group of groups) {
      const list = playersByGroup[group];
      if (!list.length) continue;

      const rosterPicks = [], squadPicks = [], available = [];
      for (const p of list) {
        const role = pickedRole(p.index);
        if (role === 'R') rosterPicks.push(p);
        else if (role === 'PS') squadPicks.push(p);
        else available.push(p);
      }
      // Picked players sit in the order they were clicked, not roster order.
      rosterPicks.sort((a, b) => picked.roster.indexOf(a.index) - picked.roster.indexOf(b.index));
      squadPicks.sort((a, b) => picked.squad.indexOf(a.index) - picked.squad.indexOf(b.index));

      const section = document.createElement('section');
      section.className = 'position-section';
      section.id = `group-${group}`;

      const header = document.createElement('div');
      header.className = 'position-group-title';
      header.innerHTML = `
        <h3>${group}</h3>
        <span class="pos-counts">
          <span class="pos-count-r">${rosterPicks.length} Roster</span>
          &middot;
          <span class="pos-count-ps">${squadPicks.length} Practice Squad</span>
        </span>
      `;
      section.appendChild(header);

      const inner = document.createElement('div');
      inner.innerHTML =
        rosterPicks.map(p => rowHTML(p, 'R')).join('') +
        squadPicks.map(p => rowHTML(p, 'PS')).join('') +
        ((rosterPicks.length || squadPicks.length) && available.length ? `<div class="available-divider">available</div>` : '') +
        available.map(p => rowHTML(p, null)).join('');
      section.appendChild(inner);

      playerSelectionArea.appendChild(section);
    }

    playerSelectionArea.querySelectorAll('.player-row').forEach(row => {
      row.addEventListener('click', (e) => {
        const idx = parseInt(row.dataset.playerIndex, 10);
        const btn = e.target.closest('button[data-action]');
        if (btn) {
          if (btn.dataset.action === 'roster') toggleRoster(idx);
          else toggleSquad(idx);
          return;
        }
        // Clicking the row itself adds to the roster. Already-picked rows only
        // respond to their buttons, so a stray tap can't drop someone.
        if (!pickedRole(idx)) toggleRoster(idx);
      });
    });
  }

  function renderTeamModal() {
    if (!teamModalBody) return;
    teamModalVersion.textContent = existingVersion > 0 ? `Saved v${existingVersion}` : 'Unsaved';

    const rosterByGroup = {}, squadByGroup = {};
    groups.forEach(g => { rosterByGroup[g] = []; squadByGroup[g] = []; });
    picked.roster.forEach(i => rosterByGroup[bucket(players[i].pos)].push(players[i]));
    picked.squad.forEach(i => squadByGroup[bucket(players[i].pos)].push(players[i]));

    let html = '';
    html += `<h6>Roster <span>${picked.roster.length}/${ROSTER_SIZE}</span></h6>`;
    let rosterAny = false;
    for (const g of groups) {
      const list = rosterByGroup[g];
      if (!list.length) continue;
      rosterAny = true;
      html += `<div class="team-modal-section"><h6>${g} <span>${list.length}</span></h6><ul class="team-modal-list">`;
      list.forEach(p => {
        html += `<li class="is-roster"><span>${p.name}</span><span class="player-num">#${p.number} ${p.pos}</span></li>`;
      });
      html += `</ul></div>`;
    }
    if (!rosterAny) html += `<p class="text-muted small">No roster picks yet.</p>`;

    html += `<hr><h6>Practice Squad <span>${picked.squad.length}/${SQUAD_SIZE}</span></h6>`;
    let squadAny = false;
    for (const g of groups) {
      const list = squadByGroup[g];
      if (!list.length) continue;
      squadAny = true;
      html += `<div class="team-modal-section"><h6>${g} <span>${list.length}</span></h6><ul class="team-modal-list">`;
      list.forEach(p => {
        html += `<li class="is-squad"><span>${p.name}</span><span class="player-num">#${p.number} ${p.pos}</span></li>`;
      });
      html += `</ul></div>`;
    }
    if (!squadAny) html += `<p class="text-muted small">No practice squad picks yet.</p>`;

    teamModalBody.innerHTML = html;
  }

  // --- Schedule rendering: vertical stack, weeks 1..maxWeek with BYE rows ---
  function renderSchedule() {
    if (!scheduleStack) return;
    scheduleStack.innerHTML = '';
    if (!schedule.length) return;

    const minWeek = Math.min(...schedule.map(g => g.week));
    const maxWeek = Math.max(...schedule.map(g => g.week));

    for (let w = minWeek; w <= maxWeek; w++) {
      const game = schedule.find(g => g.week === w);
      const row = document.createElement('div');
      if (!game) {
        row.className = 'game-row bye';
        row.innerHTML = `
          <div class="game-meta">
            <div class="game-week">Week ${w}</div>
            <div class="game-opponent">BYE</div>
          </div>
        `;
        scheduleStack.appendChild(row);
        continue;
      }

      const prefix = game.home ? 'vs' : '@';
      const dateStr = new Date(game.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const pick = picked.games[game.week];
      row.className = 'game-row' + (pick === 'W' ? ' win' : pick === 'L' ? ' loss' : '');
      row.dataset.week = String(game.week);
      row.innerHTML = `
        <button type="button" class="wl-side l" data-pick="L" aria-label="Predict loss">L</button>
        <div class="game-meta">
          <div class="game-week">Week ${game.week}</div>
          <div class="game-opponent">${prefix} ${game.opponent}</div>
          <div class="game-date">${dateStr}</div>
        </div>
        <button type="button" class="wl-side w" data-pick="W" aria-label="Predict win">W</button>
      `;
      scheduleStack.appendChild(row);
    }

    scheduleStack.querySelectorAll('.wl-side').forEach(btn => btn.addEventListener('click', handleGamePick));
  }

  function handleGamePick(e) {
    const side = e.currentTarget;
    const row  = side.closest('.game-row');
    const week = parseInt(row.dataset.week, 10);
    const pick = side.dataset.pick;
    const current = picked.games[week];

    row.classList.remove('win', 'loss');
    if (current === pick) {
      delete picked.games[week];
    } else {
      picked.games[week] = pick;
      row.classList.add(pick === 'W' ? 'win' : 'loss');
    }
    flash(row);
    updateCounts();
  }

  // --- Counters + completion-driven flash ---
  function updateCounts() {
    counterEls.roster.forEach(el => el.textContent = picked.roster.length);
    counterEls.squad.forEach(el => el.textContent = picked.squad.length);
    const gameVals = Object.values(picked.games);
    const wins = gameVals.filter(v => v === 'W').length;
    const losses = gameVals.filter(v => v === 'L').length;
    counterEls.games.forEach(el => el.textContent = `${wins}-${losses}`);

    const completeRoster = picked.roster.length === ROSTER_SIZE && picked.squad.length === SQUAD_SIZE;
    const completeAll = completeRoster && Object.keys(picked.games).length === GAMES_TOTAL;

    [actionSubmit, actionSubmit2].forEach(b => {
      if (!b) return;
      b.disabled = !completeAll || !currentUser;
      b.textContent = submitButtonLabel();
    });

    if (completeRoster && !lastCompleteRoster) flash(actionPredictSchedule);
    if (completeAll && !lastCompleteAll) {
      flash(actionSubmit);
      flash(actionSubmit2);
    }
    lastCompleteRoster = completeRoster;
    lastCompleteAll = completeAll;
  }

  // --- Mutations ---
  function removePlayer(idx) {
    picked.roster = picked.roster.filter(i => i !== idx);
    picked.squad  = picked.squad.filter(i => i !== idx);
    afterMutation();
  }
  // Roster button: on the roster already -> drop them; otherwise claim them.
  function toggleRoster(idx) {
    if (pickedRole(idx) === 'R') { removePlayer(idx); return; }
    if (picked.roster.length >= ROSTER_SIZE) { wiggleRow(idx, 'Roster full'); return; }
    picked.squad = picked.squad.filter(i => i !== idx);
    picked.roster.push(idx);
    afterMutation();
  }
  // Practice squad button: same toggle, other list.
  function toggleSquad(idx) {
    if (pickedRole(idx) === 'PS') { removePlayer(idx); return; }
    if (picked.squad.length >= SQUAD_SIZE) { wiggleRow(idx, 'Practice squad full'); return; }
    picked.roster = picked.roster.filter(i => i !== idx);
    picked.squad.push(idx);
    afterMutation();
  }
  function wiggleRow(idx, msg) {
    const row = playerSelectionArea.querySelector(`.player-row[data-player-index="${idx}"]`);
    if (!row) return;
    row.animate(
      [{ transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }],
      { duration: 200, iterations: 2 }
    );
    if (msg) console.log('[picker]', msg);
  }
  function afterMutation() {
    renderPositionGroups();
    renderPositionNav();
    renderRosterChangeBanner();
    updateCounts();
  }

  // --- Firestore IO ---
  async function loadExistingSubmission(uid) {
    const db = firebase.firestore();
    try {
      const snap = await db.collection('users').doc(uid).collection('submission').doc('current').get();
      if (!snap.exists) return null;
      return snap.data();
    } catch (err) {
      console.error('[app] loadExistingSubmission failed', err);
      return null;
    }
  }
  function applyExistingSubmission(data) {
    if (!data) return;
    const nameToIndex = {};
    players.forEach((p, i) => { nameToIndex[p.name] = i; });

    // Detect names from the saved submission that are no longer in the current roster
    const missR = (data.roster || []).filter(n => nameToIndex[n] === undefined);
    const missS = (data.squad  || []).filter(n => nameToIndex[n] === undefined);

    picked.roster = (data.roster || []).map(n => nameToIndex[n]).filter(i => i !== undefined);
    picked.squad  = (data.squad  || []).map(n => nameToIndex[n]).filter(i => i !== undefined);
    picked.games  = data.games || {};
    existingVersion = typeof data.version === 'number' ? data.version : 1;
    missingPlayers = { roster: missR, squad: missS };
  }

  function renderRosterChangeBanner() {
    const banner = document.getElementById('rosterChangeBanner');
    const body   = document.getElementById('rosterChangeBody');
    if (!banner || !body) return;

    const total = missingPlayers.roster.length + missingPlayers.squad.length;
    if (total === 0) {
      banner.classList.add('d-none');
      body.innerHTML = '';
      return;
    }

    const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const lines = [];
    missingPlayers.roster.forEach(n => lines.push(`<li>${escape(n)} <span class="text-muted small">(was Roster)</span></li>`));
    missingPlayers.squad.forEach(n  => lines.push(`<li>${escape(n)} <span class="text-muted small">(was P. Squad)</span></li>`));

    const refillR = ROSTER_SIZE - picked.roster.length;
    const refillS = SQUAD_SIZE  - picked.squad.length;
    const bits = [];
    if (refillR > 0) bits.push(`${refillR} roster spot${refillR > 1 ? 's' : ''}`);
    if (refillS > 0) bits.push(`${refillS} squad spot${refillS > 1 ? 's' : ''}`);
    const refillText = bits.length
      ? `Refill ${bits.join(' + ')}, then click <strong>Update (v${existingVersion + 1})</strong> to save.`
      : `Click <strong>Update (v${existingVersion + 1})</strong> to save the cleaned-up version.`;

    body.innerHTML =
      `<p class="mb-2">${total} of your previous picks ${total === 1 ? 'is' : 'are'} no longer on the team:</p>` +
      `<ul class="mb-2">${lines.join('')}</ul>` +
      `<p class="mb-0">We've cleared them from your picks. ${refillText}</p>`;
    banner.classList.remove('d-none');
  }
  // Home-view status line + version pill, derived from current state.
  function updateHomeStatus() {
    const missTotal = missingPlayers.roster.length + missingPlayers.squad.length;
    if (priorStatusEl) {
      priorStatusEl.textContent = existingVersion <= 0 ? ''
        : missTotal > 0
          ? `Saved submission (v${existingVersion}) — ${missTotal} pick${missTotal > 1 ? 's' : ''} need refilling (roster has changed).`
          : `You have a saved submission (v${existingVersion}). Click below to edit.`;
    }
    if (homeVersionEl) {
      homeVersionEl.textContent = existingVersion > 0 ? `v${existingVersion}` : '';
      homeVersionEl.classList.toggle('d-none', existingVersion <= 0);
    }
  }

  async function submitPicks() {
    if (!currentUser) { alert('You must be signed in.'); return; }
    if (picked.roster.length !== ROSTER_SIZE) return alert(`Roster must be ${ROSTER_SIZE}.`);
    if (picked.squad.length !== SQUAD_SIZE) return alert(`Practice squad must be ${SQUAD_SIZE}.`);
    if (Object.keys(picked.games).length !== GAMES_TOTAL) return alert(`Predict all ${GAMES_TOTAL} games.`);

    [actionSubmit, actionSubmit2].forEach(b => { if (b) { b.disabled = true; b.textContent = 'Saving…'; }});

    const db = firebase.firestore();
    const ts = firebase.firestore.FieldValue.serverTimestamp();
    const newVersion = existingVersion + 1;
    const payload = {
      version: newVersion,
      roster: picked.roster.map(i => players[i].name),
      squad:  picked.squad.map(i => players[i].name),
      games:  { ...picked.games },
      updatedAt: ts,
      email: currentUser.email || null,
      displayName: currentUser.displayName || null
    };

    const userRef = db.collection('users').doc(currentUser.uid);
    try {
      await userRef.collection('submission').doc('current').set(payload, { merge: false });
      await userRef.collection('submissionHistory').add(payload);
      existingVersion = newVersion;
      missingPlayers = { roster: [], squad: [] };
      renderRosterChangeBanner();
      updateHomeStatus();
      if (submittedVersionEl) submittedVersionEl.textContent = `v${newVersion}`;
      showView('submitted');
    } catch (err) {
      console.error('[app] submit failed', err);
      alert('Save failed: ' + err.message);
    } finally {
      [actionSubmit, actionSubmit2].forEach(b => { if (b) { b.disabled = false; b.textContent = submitButtonLabel(); }});
    }
  }

  // --- Boot ---
  document.addEventListener('DOMContentLoaded', () => {
    renderPositionGroups();
    renderSchedule();
    renderPositionNav();
    updateCounts();

    if (btnStart)               btnStart.addEventListener('click', () => showView('selection'));
    if (actionPredictSchedule)  actionPredictSchedule.addEventListener('click', () => showView('schedule'));
    if (actionBackToRoster)     actionBackToRoster.addEventListener('click', () => showView('selection'));
    if (actionSubmit)           actionSubmit.addEventListener('click', submitPicks);
    if (actionSubmit2)          actionSubmit2.addEventListener('click', submitPicks);
    if (editAgainBtn)           editAgainBtn.addEventListener('click', () => showView('selection'));
    homeButtons.forEach(b => b.addEventListener('click', () => showView('home')));

    const teamModalEl = document.getElementById('teamModal');
    if (teamModalEl) teamModalEl.addEventListener('show.bs.modal', renderTeamModal);
  });

  // --- Sync with auth ---
  function init() {
    if (!window.HWP_AUTH) { setTimeout(init, 50); return; }
    window.HWP_AUTH.onUser(async (user) => {
      currentUser = user || null;
      if (!user) {
        picked = { roster: [], squad: [], games: {} };
        missingPlayers = { roster: [], squad: [] };
        existingVersion = 0;
        lastCompleteRoster = false;
        lastCompleteAll = false;
        updateHomeStatus();
        afterMutation();
        renderSchedule();
        return;
      }
      const existing = await loadExistingSubmission(user.uid);
      if (existing) {
        applyExistingSubmission(existing);
      } else {
        picked = { roster: [], squad: [], games: {} };
        missingPlayers = { roster: [], squad: [] };
        existingVersion = 0;
      }
      updateHomeStatus();
      // Reset transition flags so flash doesn't fire just from loading prior data
      lastCompleteRoster = picked.roster.length === ROSTER_SIZE && picked.squad.length === SQUAD_SIZE;
      lastCompleteAll = lastCompleteRoster && Object.keys(picked.games).length === GAMES_TOTAL;
      afterMutation();
      renderSchedule();
    });
  }
  init();
})();
