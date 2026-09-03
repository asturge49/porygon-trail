// Porygon Trail - Battle Outcome Debug Hook
// Lets a staging tester force the next battle roll to win or lose, so
// upcoming-feature runs (e.g. testing post-victory/post-death flows) don't
// require actually grinding out a real result first.
//
// This file is loaded unconditionally on every host, prod included — same
// as johto-debug-screen.js. What keeps it from ever affecting a real game is
// that nothing sets forcedOutcome outside screens/debug-panel-screen.js,
// and that screen is only reachable through the same
// !PT.Config.isProd + ?debug=1 gate as the Johto debug harness
// (see screens/title-screen.js). A player on the real prod domain can never
// navigate to the screen that arms this, so resolveOutcome() always falls
// through to the real rng.chance(chance) roll for them.
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    let forcedOutcome = null; // null | 'win' | 'lose' — single-use, cleared on read
    let alwaysWinEnabled = false; // persistent toggle — every battle wins while on, no re-arming needed
    let autoCatchEnabled = false; // persistent toggle — every wild catch attempt auto-succeeds while on

    PT.Engine.DebugPanel = {
        getForcedOutcome() {
            return forcedOutcome;
        },

        setForcedOutcome(value) {
            forcedOutcome = (value === 'win' || value === 'lose') ? value : null;
        },

        getAlwaysWinEnabled() {
            return alwaysWinEnabled;
        },

        setAlwaysWinEnabled(value) {
            alwaysWinEnabled = !!value;
        },

        getAutoCatchEnabled() {
            return autoCatchEnabled;
        },

        setAutoCatchEnabled(value) {
            autoCatchEnabled = !!value;
        },

        // Drop-in replacement for `rng.chance(chance)` at a battle-resolution
        // site. A single-use forced outcome (if armed) takes priority and is
        // consumed on read; otherwise the persistent "always win" toggle
        // applies to every battle without needing to be re-armed; otherwise
        // falls back to the real roll.
        resolveOutcome(chance, rng) {
            if (forcedOutcome === 'win') {
                forcedOutcome = null;
                return true;
            }
            if (forcedOutcome === 'lose') {
                forcedOutcome = null;
                return false;
            }
            if (alwaysWinEnabled) {
                return true;
            }
            return rng.chance(chance);
        }
    };
})();
