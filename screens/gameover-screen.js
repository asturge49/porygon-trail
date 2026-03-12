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
                blackout: "All your Pokemon have fainted...",
                team_rocket: "Team Rocket overwhelmed you..."
            };

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

            const div = document.createElement('div');
            div.className = 'screen gameover-screen';
            div.innerHTML = `
                <div class="gameover-title">GAME OVER</div>
                <div class="text-box text-center" style="font-size: 8px;">
                    ${reasons[state.gameOverReason] || "Your journey has ended."}
                    <br>You made it to ${route.name}.
                </div>
                <div class="score-breakdown">
                    <div>Days Survived: ${state.daysElapsed}</div>
                    <div>Location: ${route.name} (${state.currentLocationIndex + 1}/${PT.Data.Routes.length})</div>
                    <div>Pokemon Caught: ${state.pokedexCaught.length}</div>
                    <div>Pokemon Lost: ${state.pokemonLost}</div>
                    <div>Badges: ${state.badges.filter(b => b !== 'champion').length}</div>
                    <div>Team Rocket Defeated: ${state.teamRocketDefeated}x</div>
                    <div class="score-total">FINAL SCORE: ${score.toLocaleString()}</div>
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
