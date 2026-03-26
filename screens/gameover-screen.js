// Porygon Trail - Game Over Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.GAMEOVER = {
        render(container, state) {
            const { score, breakdown } = PT.Engine.Scoring.calculateScore(state);
            const route = PT.Engine.GameState.getCurrentRoute(state);
            const reasons = {
                starvation: "Your team starved on the trail...",
                blackout: "All your Pokemon have perished...",
                party_wiped: "All your Pokemon have perished...",
                team_rocket: "Team Rocket overwhelmed you..."
            };

            // Clear save file — this run is over
            PT.Engine.GameState.deleteSave();

            // Save Pokedex data across playthroughs
            PT.Engine.Scoring.updateGlobalPokedex(state);

            // Save score
            PT.Engine.Scoring.saveToLeaderboard({
                name: state.trainerName,
                score: score,
                pokedexCount: state.pokedexCaught.length,
                badges: state.badges.length,
                daysElapsed: state.daysElapsed,
                date: new Date().toLocaleDateString(),
                won: false
            });

            // Build memorial Pokemon grid from pokedex
            const caughtPokemon = state.pokedexCaught.map(id => {
                const data = PT.Data.Pokemon.find(p => p.id === id);
                if (!data) return null;
                return {
                    name: data.name,
                    spriteUrl: PT.Engine.GameState.getSpriteUrl(id)
                };
            }).filter(Boolean);

            // Build badges display
            const badgeList = state.badges.filter(b => b !== 'champion');

            const div = document.createElement('div');
            div.className = 'screen gameover-screen';
            div.innerHTML = `
                <div class="gameover-title">HERE LIES ${state.trainerName.toUpperCase()}</div>
                <div class="text-box text-center" style="font-size: 8px;">
                    ${reasons[state.gameOverReason] || "Your journey has ended."}
                    <br>Made it to <strong>${route.name}</strong> in ${state.daysElapsed} days.
                </div>

                <div class="memorial-section">
                    <div class="memorial-label">~ Pokemon Encountered ~</div>
                    <div class="memorial-pokemon-grid">
                        ${caughtPokemon.map(p => `
                            <div class="memorial-pokemon">
                                <img class="memorial-sprite" src="${p.spriteUrl}" alt="${p.name}"
                                     onerror="this.style.display='none'">
                                <div class="memorial-name">${p.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${badgeList.length > 0 ? `
                <div class="memorial-section">
                    <div class="memorial-label">~ Badges Earned ~</div>
                    <div style="font-size: 8px; text-align: center;">
                        ${badgeList.map(b => `<span class="badge-earned">${b}</span>`).join(' ')}
                    </div>
                </div>
                ` : ''}

                <div class="score-breakdown" style="font-size: 7px;">
                    <div>Days Survived: ${state.daysElapsed}</div>
                    <div>Furthest Point: ${route.name} (${state.currentLocationIndex + 1}/${PT.Data.Routes.length})</div>
                    <div>Pokemon Caught: ${state.pokedexCaught.length}</div>
                    <div>Pokemon Lost: ${state.pokemonLost}</div>
                    <div>Badges: ${badgeList.length}/8</div>
                    <div>Gym Battles Won: ${state.gymBattlesWon}</div>
                    <div>Team Rocket Defeated: ${state.teamRocketDefeated}x</div>
                    <div class="score-total">FINAL SCORE: ${score.toLocaleString()}</div>
                </div>

                <div class="text-box text-center" style="font-size: 7px; font-style: italic;">
                    "The trail is long and unforgiving.<br>Few trainers make it to the end."
                </div>

                <div class="btn-row" style="width: 100%; max-width: 500px;">
                    <button class="btn flex-1" id="btn-retry">TRY AGAIN</button>
                    <button class="btn flex-1" id="btn-leaderboard">LEADERBOARD</button>
                </div>
            `;
            container.appendChild(div);

            document.getElementById('btn-retry').addEventListener('click', () => {
                PT.State = null;
                PT.App.goto('TITLE');
            });
            document.getElementById('btn-leaderboard').addEventListener('click', () => {
                PT.App.goto('LEADERBOARD');
            });
        }
    };
})();
