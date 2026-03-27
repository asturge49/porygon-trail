// Porygon Trail - Title Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.TITLE = {
        render(container) {
            const hasSave = PT.Engine.GameState.hasSaveGame();

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
                <div style="text-align:center;margin-bottom:4px;">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/137.png"
                         alt="Porygon" style="width:64px;height:64px;image-rendering:pixelated;"
                         onerror="this.style.display='none'">
                </div>
                <div class="title-logo">PORYGON<br>TRAIL</div>
                <div class="title-subtitle">KANTO EXPEDITION</div>
                <div class="title-subtitle text-sm" style="margin-top: -12px; opacity: 0.7;">- Gen I Survival Adventure -</div>
                <div class="title-menu">
                    ${hasSave ? '<button class="btn btn-wide" id="btn-continue-game">CONTINUE</button>' : ''}
                    <button class="btn btn-wide" id="btn-new-game">NEW GAME</button>
                    <button class="btn btn-wide" id="btn-pokedex">POKÉDEX</button>
                    <button class="btn btn-wide" id="btn-leaderboard">LEADERBOARD</button>
                    <button class="btn btn-wide btn-small" id="btn-sound">SOUND: ${PT.Engine.Audio && PT.Engine.Audio.isEnabled() ? 'ON' : 'OFF'}</button>
                </div>
                <div class="blink text-sm" style="margin-top: 8px;">PRESS START</div>
            `;
            container.appendChild(div);

            // Continue saved game
            if (hasSave) {
                document.getElementById('btn-continue-game').addEventListener('click', () => {
                    const loaded = PT.Engine.GameState.loadGame();
                    if (loaded) {
                        PT.State = loaded;
                        PT.App.goto('TRAVEL');
                    } else {
                        alert('Save data corrupted. Starting new game.');
                        PT.Engine.GameState.deleteSave();
                        PT.App.goto('STARTER');
                    }
                });
            }

            document.getElementById('btn-new-game').addEventListener('click', () => {
                if (hasSave) {
                    // Confirm overwrite
                    if (!confirm('This will overwrite your saved game. Continue?')) return;
                    PT.Engine.GameState.deleteSave();
                }
                PT.App.goto('STARTER');
            });
            document.getElementById('btn-pokedex').addEventListener('click', () => {
                PT.App.goto('POKEDEX');
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
