// Porygon Trail - Battle Debug Panel (staging only)
// Reachable only from the gated debug row on the title screen (see
// title-screen.js's showDebugHarness / ?debug=1 check) — never shown on the
// real prod domain regardless of how this code got deployed there.
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.DEBUGPANEL = {
        render(container) {
            const div = document.createElement('div');
            div.className = 'screen starter-screen';

            const render = () => {
                const armed = PT.Engine.DebugPanel.getForcedOutcome();
                const alwaysWin = PT.Engine.DebugPanel.getAlwaysWinEnabled();
                const autoCatch = PT.Engine.DebugPanel.getAutoCatchEnabled();
                const hasRun = !!PT.State;
                div.innerHTML = `
                    <div class="text-box">
                        <p><strong>BATTLE DEBUG PANEL</strong> (staging only)</p>
                        <p style="margin-top: 6px;">${alwaysWin
                            ? '<strong>ALWAYS WIN: ON</strong> — every battle (wild, gym, elite four, rocket, trainer) wins automatically.'
                            : 'Always Win is off — battles roll normally unless force-armed below.'}</p>
                        <p style="margin-top: 6px;">${armed
                            ? `<strong>ARMED: next battle will ${armed.toUpperCase()}</strong> (one-time, overrides Always Win)`
                            : 'Nothing one-time armed.'}</p>
                    </div>
                    <button class="btn btn-wide" id="btn-toggle-always-win" style="margin-bottom:6px;">
                        ${alwaysWin ? 'TURN ALWAYS WIN OFF' : 'TURN ALWAYS WIN ON'}
                    </button>
                    <button class="btn btn-wide" id="btn-force-lose" style="margin-bottom:6px;">FORCE LOSE NEXT BATTLE</button>
                    <button class="btn btn-wide btn-small" id="btn-clear">CLEAR ALL BATTLE OVERRIDES</button>

                    <div class="text-box" style="margin-top:12px;">
                        <p><strong>FAST-RUN TOOLS</strong></p>
                        <p style="margin-top: 6px;">${autoCatch
                            ? '<strong>AUTO-CATCH: ON</strong> — every wild catch attempt succeeds.'
                            : 'Auto-catch is off — catches roll normally.'}</p>
                    </div>
                    <button class="btn btn-wide" id="btn-toggle-autocatch" style="margin-bottom:6px;">
                        ${autoCatch ? 'TURN AUTO-CATCH OFF' : 'TURN AUTO-CATCH ON'}
                    </button>
                    <button class="btn btn-wide" id="btn-add-food" ${hasRun ? '' : 'disabled'} style="margin-bottom:6px;">
                        ${hasRun ? 'ADD 1000 FOOD' : 'ADD 1000 FOOD (no run in progress)'}
                    </button>

                    <button class="btn btn-wide btn-small" id="btn-debug-panel-back" style="margin-top:8px;">BACK</button>
                `;
                document.getElementById('btn-toggle-always-win').addEventListener('click', () => {
                    PT.Engine.DebugPanel.setAlwaysWinEnabled(!alwaysWin);
                    render();
                });
                document.getElementById('btn-force-lose').addEventListener('click', () => {
                    PT.Engine.DebugPanel.setForcedOutcome('lose');
                    render();
                });
                document.getElementById('btn-clear').addEventListener('click', () => {
                    PT.Engine.DebugPanel.setForcedOutcome(null);
                    PT.Engine.DebugPanel.setAlwaysWinEnabled(false);
                    render();
                });
                document.getElementById('btn-toggle-autocatch').addEventListener('click', () => {
                    PT.Engine.DebugPanel.setAutoCatchEnabled(!autoCatch);
                    render();
                });
                document.getElementById('btn-add-food').addEventListener('click', () => {
                    if (!PT.State) return;
                    PT.State.resources.food = (PT.State.resources.food || 0) + 1000;
                    if (PT.Engine.GameState.saveGame) PT.Engine.GameState.saveGame(PT.State);
                    render();
                });
                document.getElementById('btn-debug-panel-back').addEventListener('click', () => {
                    // Reachable both pre-game (pushed/goto'd from TITLE) and
                    // mid-run (pushed from the TRAVEL menu) — pop back to
                    // whichever screen actually opened this one if there is
                    // one, otherwise fall back to TITLE.
                    if (PT.App.screenStack && PT.App.screenStack.length > 0) {
                        PT.App.pop();
                    } else {
                        PT.App.goto('TITLE');
                    }
                });
            };

            container.appendChild(div);
            render();
        }
    };
})();
