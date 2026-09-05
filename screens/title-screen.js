// Porygon Trail - Title Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // Debug harness visibility (§ hardening): !PT.Config.isProd alone is a
    // hostname whitelist — anyone on a URL that isn't in that exact list
    // (e.g. a Vercel per-deployment preview URL for a push to main, which
    // is NOT the same host as the canonical prod domain) sees this button
    // by default. Requiring an explicit ?debug=1 in the URL too means it
    // never shows on a plain link someone might mistake for "just the app,"
    // on any host — you have to know to ask for it.
    function debugHarnessRequested() {
        try {
            return new URLSearchParams(window.location.search).get('debug') === '1';
        } catch (e) {
            return false;
        }
    }

    PT.Screens.TITLE = {
        render(container) {
            const GS = PT.Engine.GameState;
            const auth = PT.Engine.Auth;
            const authConfigured = auth && auth.isConfigured();
            const showDebugHarness = !PT.Config.isProd && debugHarnessRequested();

            // Guard: if auth is configured and user isn't logged in (and isn't a
            // staging-only guest), send them to login
            if (authConfigured && !auth.isLoggedIn() && !auth.isGuestMode()) {
                PT.App.goto('LOGIN');
                return;
            }

            const hasLocal = GS.hasSaveGame();
            const isLoggedIn = auth && auth.isLoggedIn();
            const username = isLoggedIn ? auth.getCurrentUsername() : null;

            // Tagline stats — site-wide counts across every player's account
            // (engine/leaderboard-api.js's getGlobalPlayerStats, backed by
            // Supabase), not just this device's local records. "Fallen" =
            // every completed run that didn't end in a Red win; "Hall of
            // Fame" = runs that did. Rendered with this device's own local
            // PT.Engine.Records tally first (so the tagline isn't blank
            // while the network request is in flight) and swapped for the
            // global count once it resolves; falls back to staying local-only
            // if Supabase isn't configured or the query fails.
            const records = PT.Engine.Records ? PT.Engine.Records.getRecords() : null;
            const totalRuns = records ? (records.totalRuns || 0) : 0;
            const redDefeated = records ? (records.totalWins || 0) : 0;
            // "Trainers fallen on the trail" pulls straight from the total-runs
            // counter now, not runs-minus-wins — every logged run, win or not.
            const fallenCount = totalRuns;

            const div = document.createElement('div');
            div.className = 'screen title-screen';
            div.innerHTML = `
                <div style="text-align:center;margin-bottom:4px;">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/137.png"
                         alt="Porygon" style="width:64px;height:64px;image-rendering:pixelated;"
                         onerror="this.style.display='none'">
                </div>
                <div class="title-logo">PORYGON<br>TRAIL</div>
                <div class="title-tagline">
                    Trainers fallen on the trail = <span id="tagline-fallen">${fallenCount}</span><br>
                    Hall of Fame members = <span id="tagline-hof">${redDefeated}</span>
                </div>
                <div style="font-size: 7px; text-align: center; color: var(--gb-dark);">created by ProfOak</div>

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
                </div>

                <div class="title-grid-2x2">
                    <button class="btn" id="btn-pokedex">POKÉDEX</button>
                    <button class="btn" id="btn-guide">GUIDE</button>
                    <button class="btn" id="btn-leaderboard">LEADERBOARD</button>
                    <button class="btn" id="btn-records">RECORDS</button>
                </div>

                <div class="title-utility-group">
                    ${isLoggedIn ? `
                    <button class="btn btn-wide btn-small" id="btn-profile">
                        SIGN OUT (${username.toUpperCase()})
                    </button>
                    ` : ''}
                    <button class="btn btn-wide btn-small" id="btn-sound">SOUND: ${PT.Engine.Audio && PT.Engine.Audio.isEnabled() ? 'ON' : 'OFF'}</button>
                    <button class="btn btn-wide btn-small" id="btn-discord">JOIN DISCORD</button>
                    ${showDebugHarness ? `
                    <button class="btn btn-wide btn-small" id="btn-johto-debug">JUMP TO JOHTO (DEBUG)</button>
                    <button class="btn btn-wide btn-small" id="btn-debug-panel">BATTLE DEBUG PANEL</button>
                    ` : ''}
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

            // Swap the local tagline counts for site-wide ones once the
            // global query resolves. No-op if Supabase isn't configured
            // (isGlobalEnabled false) or the fetch fails — tagline just
            // stays on this device's local counts.
            if (PT.Engine.LeaderboardAPI && PT.Engine.LeaderboardAPI.isGlobalEnabled()) {
                PT.Engine.LeaderboardAPI.getGlobalPlayerStats().then(stats => {
                    if (!stats) return;
                    const fallenEl = document.getElementById('tagline-fallen');
                    const hofEl = document.getElementById('tagline-hof');
                    if (fallenEl) fallenEl.textContent = stats.fallenCount;
                    if (hofEl) hofEl.textContent = stats.hallOfFameCount;
                }).catch(() => {});
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
                PT.App.goto('LEVEL_SELECT');
            });

            document.getElementById('btn-pokedex').addEventListener('click', () => {
                PT.App.goto('POKEDEX');
            });
            document.getElementById('btn-guide').addEventListener('click', () => {
                PT.App.goto('GUIDE');
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

            document.getElementById('btn-discord').addEventListener('click', () => {
                window.open('https://discord.gg/6yNHjbAYF', '_blank', 'noopener');
            });

            const johtoDebugBtn = document.getElementById('btn-johto-debug');
            if (johtoDebugBtn) {
                johtoDebugBtn.addEventListener('click', () => {
                    if (hasLocal && !confirm('This will overwrite your saved game. Continue?')) return;
                    PT.App.goto('JOHTODEBUG');
                });
            }

            const debugPanelBtn = document.getElementById('btn-debug-panel');
            if (debugPanelBtn) {
                debugPanelBtn.addEventListener('click', () => {
                    PT.App.goto('DEBUGPANEL');
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
