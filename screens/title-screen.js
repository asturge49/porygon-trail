// Porygon Trail - Title Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.TITLE = {
        render(container) {
            const div = document.createElement('div');
            div.className = 'screen title-screen';
            div.innerHTML = `
                <div class="title-art">
    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
    █  ▄▄▄  █  ▄▄▄  █  ▄▄▄  █  ▄  █
    █ █   █ █ █   █ █ █   █ █ █ █ █
    █ █▄▄▄█ █ █▄▄▄█ █ █▄▄▄█ █ █▄█ █
    █▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█▄▄▄▄▄█
                </div>
                <div class="title-logo">PORYGON<br>TRAIL</div>
                <div class="title-subtitle">KANTO EXPEDITION</div>
                <div class="title-subtitle text-sm" style="margin-top: -12px; opacity: 0.7;">- Gen I Survival Adventure -</div>
                <div class="title-menu">
                    <button class="btn btn-wide" id="btn-new-game">NEW GAME</button>
                    <button class="btn btn-wide" id="btn-leaderboard">LEADERBOARD</button>
                    <button class="btn btn-wide btn-small" id="btn-sound">SOUND: ${PT.Engine.Audio && PT.Engine.Audio.isEnabled() ? 'ON' : 'OFF'}</button>
                </div>
                <div class="blink text-sm" style="margin-top: 8px;">PRESS START</div>
            `;
            container.appendChild(div);

            document.getElementById('btn-new-game').addEventListener('click', () => {
                PT.App.goto('STARTER');
            });
            document.getElementById('btn-leaderboard').addEventListener('click', () => {
                PT.App.goto('LEADERBOARD');
            });
            document.getElementById('btn-sound').addEventListener('click', () => {
                if (PT.Engine.Audio) {
                    const on = PT.Engine.Audio.toggle();
                    document.getElementById('btn-sound').textContent = 'SOUND: ' + (on ? 'ON' : 'OFF');
                    if (on) PT.Engine.Audio.click();
                }
            });
        }
    };
})();
