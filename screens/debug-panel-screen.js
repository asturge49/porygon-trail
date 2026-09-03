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
                div.innerHTML = `
                    <div class="text-box">
                        <p><strong>BATTLE DEBUG PANEL</strong> (staging only)</p>
                        <p style="margin-top: 6px;">Forces the result of the very next battle
                        you fight (wild, gym, elite four, or rocket) — wins normally after that.</p>
                        <p style="margin-top: 6px;">${armed
                            ? `<strong>ARMED: next battle will ${armed.toUpperCase()}</strong>`
                            : 'Nothing armed — next battle rolls normally.'}</p>
                    </div>
                    <button class="btn btn-wide" id="btn-force-win" style="margin-bottom:6px;">FORCE WIN NEXT BATTLE</button>
                    <button class="btn btn-wide" id="btn-force-lose" style="margin-bottom:6px;">FORCE LOSE NEXT BATTLE</button>
                    <button class="btn btn-wide btn-small" id="btn-clear">CLEAR</button>
                    <button class="btn btn-wide btn-small" id="btn-debug-panel-back" style="margin-top:8px;">BACK</button>
                `;
                document.getElementById('btn-force-win').addEventListener('click', () => {
                    PT.Engine.DebugPanel.setForcedOutcome('win');
                    render();
                });
                document.getElementById('btn-force-lose').addEventListener('click', () => {
                    PT.Engine.DebugPanel.setForcedOutcome('lose');
                    render();
                });
                document.getElementById('btn-clear').addEventListener('click', () => {
                    PT.Engine.DebugPanel.setForcedOutcome(null);
                    render();
                });
                document.getElementById('btn-debug-panel-back').addEventListener('click', () => {
                    PT.App.goto('TITLE');
                });
            };

            container.appendChild(div);
            render();
        }
    };
})();
