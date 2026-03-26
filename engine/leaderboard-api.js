// Porygon Trail - Leaderboard API
// Abstraction layer for local + global leaderboards.
// Currently uses localStorage for both. When ready to add Firebase:
// 1. Add Firebase SDK to index.html
// 2. Replace the global methods below with Firebase calls
// 3. Everything else (UI, scoring) stays the same
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    const LOCAL_KEY = 'porygonTrail_leaderboard';
    const MAX_ENTRIES = 10;

    // ===== LOCAL (Personal) =====
    function getLocalLeaderboard() {
        try {
            const data = localStorage.getItem(LOCAL_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveLocal(entry) {
        const board = getLocalLeaderboard();
        board.push(entry);
        board.sort((a, b) => b.score - a.score);
        const top = board.slice(0, MAX_ENTRIES);
        try {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(top));
        } catch (e) {
            console.warn('Could not save local leaderboard:', e);
        }
        return top;
    }

    function clearLocal() {
        localStorage.removeItem(LOCAL_KEY);
    }

    // ===== GLOBAL =====
    // TODO: Replace these stubs with Firebase Realtime Database calls
    // When ready:
    //   1. npm install firebase (or add CDN script to index.html):
    //      <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-app-compat.js"></script>
    //      <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-database-compat.js"></script>
    //   2. Initialize Firebase with your config:
    //      firebase.initializeApp({ apiKey: "...", databaseURL: "...", projectId: "..." });
    //   3. Replace getGlobalLeaderboard() with:
    //      async function getGlobalLeaderboard() {
    //          const snap = await firebase.database().ref('leaderboard').orderByChild('score').limitToLast(10).once('value');
    //          const entries = [];
    //          snap.forEach(child => entries.push(child.val()));
    //          return entries.sort((a, b) => b.score - a.score);
    //      }
    //   4. Replace saveGlobal() with:
    //      async function saveGlobal(entry) {
    //          await firebase.database().ref('leaderboard').push(entry);
    //      }
    //   5. Set globalEnabled = true below

    let globalEnabled = false;

    async function getGlobalLeaderboard() {
        if (!globalEnabled) return null; // null signals "not configured"
        // Firebase implementation goes here
        return [];
    }

    async function saveGlobal(entry) {
        if (!globalEnabled) return;
        // Firebase implementation goes here
    }

    function isGlobalEnabled() {
        return globalEnabled;
    }

    // ===== UNIFIED SAVE (called from gameover/victory) =====
    function saveToLeaderboard(entry) {
        saveLocal(entry);
        saveGlobal(entry); // no-op until Firebase is configured
    }

    PT.Engine.LeaderboardAPI = {
        getLocalLeaderboard,
        getGlobalLeaderboard,
        saveToLeaderboard,
        saveLocal,
        saveGlobal,
        clearLocal,
        isGlobalEnabled
    };
})();
