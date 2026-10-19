// 2026/js/final.js
// Static final-results view. Reads HWP_PLAYERS / HWP_SCHEDULE (data.js) and
// HWP_RESULTS (results.js). No backend.

(function () {
  const R = window.HWP_RESULTS;
  const players = window.HWP_PLAYERS;
  const bucket = window.HWP_BUCKET;
  const set53 = new Set(R.final53);
  const setPS = new Set(R.finalPS);
  const pct = (n) => Math.round((n / R.total) * 100);

  function renderPodium() {
    document.getElementById('podium').innerHTML = R.leaders.map((l) => `
      <div class="rule-item">
        <div class="rule-number">${l.rank}</div>
        <div class="rule-text"><strong>${l.name}</strong> - ${l.roster}/53 Roster, ${l.ps}/16 PSquad</div>
      </div>`).join('');
  }

  function renderRoster() {
    const area = document.getElementById('roster-results');
    const groups = window.HWP_GROUPS.filter((g) => players.some((p) => bucket(p.pos) === g));
    area.innerHTML = groups.map((g) => {
      const cards = players.filter((p) => bucket(p.pos) === g).map((p) => {
        const [r, s] = R.picks[p.name] || [0, 0];
        const status = set53.has(p.name) ? 'roster' : setPS.has(p.name) ? 'squad' : 'cut';
        const badge = {
          roster: '<span class="badge bg-roster">Made 53</span>',
          squad: '<span class="badge bg-squad">Made PS</span>',
          cut: '<span class="badge text-bg-secondary">Cut</span>',
        }[status];
        const cls = status === 'cut' ? '' : ` selected-${status}`;
        return `
          <div class="player-card final-locked${cls}">
            <div class="player-name">${p.name}</div>
            <div class="player-info">#${p.number} &middot; ${p.pos}</div>
            <div class="mt-2">${badge}</div>
            <div class="mt-2" style="font-size:.85rem;">53: ${pct(r)}% &middot; PS: ${pct(s)}%</div>
          </div>`;
      }).join('');
      return `
        <section class="mb-5">
          <h3 class="position-group-title">${g}</h3>
          <div class="player-grid">${cards}</div>
        </section>`;
    }).join('');
  }

  function renderSchedule() {
    const rows = window.HWP_SCHEDULE.map((g) => {
      const [w, l] = R.games[String(g.week)] || [0, 0];
      const p = w + l ? Math.round((w / (w + l)) * 100) : 0;
      return `
        <tr>
          <td>${g.week}</td>
          <td>${g.home ? 'vs' : '@'} ${g.opponent}</td>
          <td style="width:45%;">
            <div class="progress" style="height:10px;" title="${w}W / ${l}L">
              <div class="progress-bar ${p >= 50 ? 'bg-success' : 'bg-danger'}" style="width:${p}%"></div>
            </div>
          </td>
          <td class="text-end">${p}%</td>
        </tr>`;
    }).join('');
    document.getElementById('schedule-results').innerHTML = rows;
  }

  document.getElementById('entry-count').textContent = R.total;
  renderPodium();
  renderRoster();
  renderSchedule();
})();
