// Porygon Trail - Title Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.TITLE = {
        render(container) {
            const GS = PT.Engine.GameState;
            const auth = PT.Engine.Auth;
            const authConfigured = auth && auth.isConfigured();

            // Guard: if auth is configured and user isn't logged in, send them to login
            if (authConfigured && !auth.isLoggedIn()) {
                PT.App.goto('LOGIN');
                return;
            }

            const hasLocal = GS.hasSaveGame();
            const isLoggedIn = auth && auth.isLoggedIn();
            const username = isLoggedIn ? auth.getCurrentUsername() : null;

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

                <div id="user-status" style="font-size: 7px; text-align: center; margin: 6px 0;
                     color: var(--gb-dark); min-height: 14px;">
                    ${authConfigured
                        ? (isLoggedIn
                            ? `▶ ${username.toUpperCase()} ◀`
                            : '[ GUEST ]')
                        : ''}
                </div>

                <div class="title-menu">
                    ${hasLocal ? '<button class="btn btn-wide" id="btn-continue-game">CONTINUE</button>' : ''}
                    <div id="btn-cloud-continue-wrap" style="display:none;">
                        <button class="btn btn-wide" id="btn-cloud-continue">LOAD CLOUD SAVE</button>
                    </div>
                    <button class="btn btn-wide" id="btn-new-game">NEW GAME</button>
                    <button class="btn btn-wide" id="btn-pokedex">POKÉDEX</button>
                    <button class="btn btn-wide" id="btn-leaderboard">LEADERBOARD</button>
                    <button class="btn btn-wide" id="btn-records">RECORDS</button>
                    ${isLoggedIn ? `
                    <button class="btn btn-wide btn-small" id="btn-profile">
                        SIGN OUT (${username.toUpperCase()})
                    </button>
                    ` : ''}
                    <button class="btn btn-wide btn-small" id="btn-sound">SOUND: ${PT.Engine.Audio && PT.Engine.Audio.isEnabled() ? 'ON' : 'OFF'}</button>
                </div>
                <div class="blink text-sm" style="margin-top: 8px;">PRESS START</div>
            `;
            container.appendChild(div);

            // Continue local save
            if (hasLocal) {
                document.getElementById('btn-continue-game').addEventListener('click', () => {
                    const loaded = GS.loadGame();
                    if (loaded) {
                        PT.State = loaded;
                        PT.App.goto('TRAVEL');
                    } else {
                        alert('Save data corrupted. Starting new game.');
                        GS.deleteSave();
                        PT.App.goto('STARTER');
                    }
                });
            }

            // If logged in and no local save, check for a cloud save
            if (isLoggedIn && !hasLocal) {
                GS.hasCloudSave().then(hasCloud => {
                    if (hasCloud) {
                        const wrap = document.getElementById('btn-cloud-continue-wrap');
                        if (wrap) wrap.style.display = 'block';
                    }
                }).catch(() => {});
            }

            // Load from cloud save
            const cloudBtn = document.getElementById('btn-cloud-continue');
            if (cloudBtn) {
                cloudBtn.addEventListener('click', async () => {
                    cloudBtn.textContent = 'LOADING...';
                    cloudBtn.disabled = true;
                    const loaded = await GS.cloudLoad();
                    if (loaded) {
                        // Write to local storage so we have a local copy too
                        GS.saveGame(loaded);
                        PT.State = loaded;
                        PT.App.goto('TRAVEL');
                    } else {
                        cloudBtn.textContent = 'LOAD CLOUD SAVE';
                        cloudBtn.disabled = false;
                        alert('Could not load cloud save.');
                    }
                });
            }

            document.getElementById('btn-new-game').addEventListener('click', () => {
                if (hasLocal) {
                    if (!confirm('This will overwrite your saved game. Continue?')) return;
                    GS.deleteSave();
                }
                PT.App.goto('STARTER');
            });

            document.getElementById('btn-pokedex').addEventListener('click', () => {
                PT.App.goto('POKEDEX');
            });
            document.getElementById('btn-leaderboard').addEventListener('click', () => {
                PT.App.goto('LEADERBOARD');
            });
            document.getElementById('btn-records').addEventListener('click', () => {
                PT.App.goto('RECORDS');
            });

            if (isLoggedIn) {
                document.getElementById('btn-profile').addEventListener('click', async () => {
                    await auth.signOut();
                    PT.App.goto('LOGIN');
                });
            }

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
