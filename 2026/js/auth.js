// 2026/js/auth.js
// Firebase Auth: Google popup + email magic link.
// Exposes window.HWP_AUTH = { onUser(cb), signOut(), currentUser() }

(function () {
  if (!window.firebaseConfig || !window.firebase) {
    console.error('[auth] Firebase not loaded');
    return;
  }

  if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
  const auth = firebase.auth();

  const EMAIL_LS_KEY = 'hwp:emailForSignIn';

  // --- DOM refs (may not exist on every page; guard each use) ---
  const $signedOut = document.getElementById('auth-signed-out');
  const $signedIn = document.getElementById('auth-signed-in');
  const $loading = document.getElementById('auth-loading');
  const $emailHeader = document.getElementById('signed-in-email');
  const $selectionEmail = document.getElementById('selection-user-email');
  const $btnGoogle = document.getElementById('btn-google-signin');
  const $btnSignout = document.getElementById('btn-signout');
  const $emailForm = document.getElementById('email-link-form');
  const $emailInput = document.getElementById('email-input');
  const $emailStatus = document.getElementById('email-link-status');

  function setView(state) {
    if ($loading) $loading.classList.toggle('d-none', state !== 'loading');
    if ($signedOut) $signedOut.classList.toggle('d-none', state !== 'signed-out');
    if ($signedIn) $signedIn.classList.toggle('d-none', state !== 'signed-in');
  }

  // --- Google popup ---
  if ($btnGoogle) {
    $btnGoogle.addEventListener('click', async () => {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
      } catch (err) {
        console.error('[auth] Google sign-in failed', err);
        alert('Google sign-in failed: ' + err.message);
      }
    });
  }

  // --- Email magic link: send ---
  if ($emailForm) {
    $emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = ($emailInput && $emailInput.value || '').trim();
      if (!email) return;
      const settings = {
        url: window.location.origin + window.location.pathname,
        handleCodeInApp: true
      };
      try {
        await auth.sendSignInLinkToEmail(email, settings);
        window.localStorage.setItem(EMAIL_LS_KEY, email);
        if ($emailStatus) $emailStatus.textContent = 'Check your email for a sign-in link.';
      } catch (err) {
        console.error('[auth] sendSignInLinkToEmail failed', err);
        if ($emailStatus) $emailStatus.textContent = 'Error: ' + err.message;
      }
    });
  }

  // --- Email magic link: complete sign-in if landed via link ---
  async function completeEmailLinkSignIn() {
    if (!auth.isSignInWithEmailLink(window.location.href)) return;
    let email = window.localStorage.getItem(EMAIL_LS_KEY);
    if (!email) {
      email = window.prompt('Confirm your email to complete sign-in');
      if (!email) return;
    }
    try {
      await auth.signInWithEmailLink(email, window.location.href);
      window.localStorage.removeItem(EMAIL_LS_KEY);
      // strip the magic-link query so refresh doesn't retrigger
      const clean = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, clean);
    } catch (err) {
      console.error('[auth] signInWithEmailLink failed', err);
      alert('Sign-in link is invalid or expired: ' + err.message);
    }
  }

  // --- Sign out ---
  if ($btnSignout) {
    $btnSignout.addEventListener('click', () => auth.signOut());
  }

  // --- State observer ---
  const userListeners = [];
  auth.onAuthStateChanged((user) => {
    if (user) {
      setView('signed-in');
      if ($emailHeader) $emailHeader.textContent = user.email || user.displayName || '(signed in)';
      if ($selectionEmail) $selectionEmail.textContent = user.email || '';
    } else {
      setView('signed-out');
    }
    userListeners.forEach((cb) => { try { cb(user); } catch (e) { console.error(e); } });
  });

  window.HWP_AUTH = {
    onUser(cb) { userListeners.push(cb); if (auth.currentUser !== undefined) cb(auth.currentUser); },
    signOut() { return auth.signOut(); },
    currentUser() { return auth.currentUser; }
  };

  completeEmailLinkSignIn();
})();
