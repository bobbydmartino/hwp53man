// js/final.js
// Final mode: Freeze cards, force blue (53) / gold (PS) highlights by exact strings,
// and show pick percentages (manual override via FINAL_DATA.pickPct or auto from Firestore).
//
// Load this AFTER app.js in index.html:
//   <script src="{{ '/js/app.js' | url }}"></script>
//   <script src="{{ '/js/final.js' | url }}"></script>

(function () {
  if (!window.FINAL_DATA) return;

  const { final53 = [], finalPS = [], pickPct = null } = window.FINAL_DATA;

  // Normalize strings for robust matching.
  const norm = (s) => (s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  const set53 = new Set(final53.map(norm));
  const setPS = new Set(finalPS.map(norm));

  // Inject style with !important to ensure our highlights win.
  (function injectFinalCSS() {
    if (document.getElementById("final-style")) return;
    const style = document.createElement("style");
    style.id = "final-style";
    style.textContent = `
      .player-card.final-locked { pointer-events: none !important; cursor: default !important; }

      .player-card.selected-roster {
        background-color: var(--roster-color) !important;
        border-color: var(--dark-blue) !important;
        color: #fff !important;
      }
      .player-card.selected-roster .player-name,
      .player-card.selected-roster .player-info { color: #fff !important; }

      .player-card.selected-squad {
        background-color: var(--squad-color) !important;
        border-color: var(--dark-blue) !important;
        color: var(--dark-blue) !important;
      }
      .player-card.selected-squad .player-name,
      .player-card.selected-squad .player-info { color: var(--dark-blue) !important; }

      /* Percentages styling helpers */
      .player-card .badge { font-size: .8rem; }
      .player-card .progress { background-color: var(--medium-gray); }
    `;
    document.head.appendChild(style);
  })();

  // Disable top controls.
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Submissions Closed";
  }
  const nameInput = document.getElementById("nameInput");
  if (nameInput) {
    nameInput.disabled = true;
    nameInput.placeholder = "Submissions Closed";
  }

  // Block all card clicks in capture phase (beats bubbling handlers).
  document.addEventListener(
    "click",
    (e) => {
      const card = e.target && e.target.closest ? e.target.closest(".player-card") : null;
      if (card) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
      }
    },
    true
  );

  // Preferred visible name source from card.
  const getCardNameRaw = (card) =>
    (card.querySelector(".player-name")?.textContent || card.textContent || "").trim();
  const getCardName = (card) => norm(getCardNameRaw(card));

  // Remove all existing listeners by cloning nodes.
  const stripEvents = (el) => {
    const clone = el.cloneNode(true);
    clone.removeAttribute("onclick");
    el.replaceWith(clone);
    return clone;
  };

  // Paint the card into its final state and add badges + pct UI once.
  const paintCard = (card) => {
    card.classList.remove("selected-roster", "selected-squad", "is-picked");
    card.classList.add("final-locked");

    const n = getCardName(card);

    if (set53.has(n)) {
      card.classList.add("selected-roster");
    } else if (setPS.has(n)) {
      card.classList.add("selected-squad");
    }

    if (!card.querySelector("[data-final-badge]")) {
      const badge = document.createElement("div");
      badge.dataset.finalBadge = "1";
      badge.style.marginTop = ".5rem";
      badge.style.fontWeight = "700";
      badge.style.fontSize = ".9rem";

      if (set53.has(n)) {
        badge.textContent = "Made 53";
        badge.className = "badge bg-roster";
      } else if (setPS.has(n)) {
        badge.textContent = "Made PS";
        badge.className = "badge bg-squad";
      } else {
        badge.textContent = "Cut";
        badge.className = "badge text-bg-secondary";
      }
      card.appendChild(badge);

      const pctWrap = document.createElement("div");
      pctWrap.dataset.finalPct = "1";
      pctWrap.className = "mt-2";
      pctWrap.innerHTML = `
        <div class="progress" style="height:8px;">
          <div class="progress-bar" role="progressbar" style="width:0%" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="text-muted" style="font-size:.85rem;margin-top:.25rem;">
          Picked by <span class="pick-pct">0%</span>
        </div>
      `;
      card.appendChild(pctWrap);
    }
  };

  // Prime currently rendered cards (remove listeners + paint).
  const primeAllCards = () => {
    const cards = Array.from(document.querySelectorAll(".player-card"));
    cards.forEach((c) => {
      const clean = stripEvents(c);
      paintCard(clean);
    });
    return cards.length;
  };

  // Observe future DOM mutations to re-freeze/repaint any new cards.
  const attachObserver = () => {
    const root = document.getElementById("player-selection-area") || document.body;
    const mo = new MutationObserver((mutations) => {
      let touched = false;
      mutations.forEach((m) => {
        m.addedNodes &&
          m.addedNodes.forEach((n) => {
            if (!(n instanceof HTMLElement)) return;

            if (n.classList && n.classList.contains("player-card")) {
              const clean = stripEvents(n);
              paintCard(clean);
              touched = true;
            }
            const innerCards = n.querySelectorAll ? n.querySelectorAll(".player-card") : [];
            innerCards.forEach((c) => {
              const clean = stripEvents(c);
              paintCard(clean);
              touched = true;
            });
          });
      });
      if (touched) updateCounts();
    });
    mo.observe(root, { childList: true, subtree: true });
  };

  // Header counters reflect official totals (fallback to 53/16 if lists are partial during testing).
  const updateCounts = () => {
    const rosterCount = document.getElementById("rosterCount");
    if (rosterCount) rosterCount.textContent = String(final53.length || 53);
    const squadCount = document.getElementById("squadCount");
    if (squadCount) squadCount.textContent = String(finalPS.length || 16);
  };

  // Optional: Rewrite deadline card to "Results Locked".
  (function rewriteDeadlineCard() {
    const titleEl = Array.from(document.querySelectorAll(".info-card-title"))
      .find((el) => /Submission Deadline/i.test(el.textContent));
    if (!titleEl) return;
    titleEl.textContent = "Results Locked";
    const text = titleEl.closest(".info-card")?.querySelector(".info-card-text");
    if (text) {
      text.innerHTML =
        "Submissions are closed. This page shows the final 53, practice squad, and how often each player was picked.";
    }
  })();

  // Percentage painting utilities.
  function paintPctValue(card, pct) {
    const pctEl = card.querySelector(".pick-pct");
    const bar = card.querySelector(".progress-bar");
    if (!pctEl || !bar) return;
    const p = Math.max(0, Math.min(100, Math.round(pct)));
    pctEl.textContent = `${p}%`;
    bar.style.width = `${p}%`;
    bar.classList.remove("bg-success", "bg-info", "bg-secondary");
    bar.classList.add(p >= 50 ? "bg-success" : p >= 20 ? "bg-info" : "bg-secondary");
  }

  // Manual percentages via FINAL_DATA.pickPct.
  function paintPercentagesManual(map) {
    // Build normalized lookup once.
    const normMap = {};
    Object.keys(map).forEach((k) => {
      normMap[norm(k)] = map[k];
    });

    document.querySelectorAll(".player-card").forEach((card) => {
      const n = getCardName(card);
      const pct = normMap[n] != null ? normMap[n] : 0;
      paintPctValue(card, pct);
    });
  }

  // Auto percentages from Firestore if no manual map.
  function paintPercentagesAuto() {
    try {
      // Reuse app if already initialized by your app.js.
      const app =
        (firebase.apps && firebase.apps.length) ?
          firebase.apps[0] :
          firebase.initializeApp(window.firebaseConfig);

      const db = firebase.firestore(app);

      db.collection("submissions")
        .get()
        .then((snap) => {
          const total = snap.size || 1;
          const counts = new Map();
          const inc = (s) => {
            if (!s) return;
            const k = norm(s);
            counts.set(k, (counts.get(k) || 0) + 1);
          };

          snap.forEach((doc) => {
            const d = doc.data() || {};
            const roster = Array.isArray(d.roster) ? d.roster : [];
            const ps = Array.isArray(d.practiceSquad) ? d.practiceSquad : [];
            roster.forEach(inc);
            ps.forEach(inc);
          });

          document.querySelectorAll(".player-card").forEach((card) => {
            const n = getCardName(card);
            const pct = ((counts.get(n) || 0) / total) * 100;
            paintPctValue(card, pct);
          });
        })
        .catch((e) => console.error("Failed to load submissions for percentages", e));
    } catch (e) {
      console.error("Firebase init failed in final mode", e);
    }
  }

  // Ready sequence.
  const ready = () => {
    primeAllCards();
    attachObserver();
    updateCounts();
    if (pickPct && typeof pickPct === "object") {
      paintPercentagesManual(pickPct);
    } else {
      paintPercentagesAuto();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
