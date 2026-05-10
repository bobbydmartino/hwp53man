// 2026/js/app.js
// Placeholder: real picker logic will land once the 90-man roster is set.
// For now: wire the "Make Your Picks" button to show the selection-view shell.

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const homeView = document.getElementById('home-view');
    const selectionView = document.getElementById('selection-view');
    const btnStart = document.getElementById('btn-start');
    const btnBack = document.getElementById('backBtn');

    if (btnStart) {
      btnStart.addEventListener('click', () => {
        homeView.classList.add('d-none');
        selectionView.classList.remove('d-none');
      });
    }
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        selectionView.classList.add('d-none');
        homeView.classList.remove('d-none');
      });
    }
  });
})();
