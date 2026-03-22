// Porygon Trail - Victory Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.VICTORY = {
        render(container, state) {
            const { score, breakdown } = PT.Engine.Scoring.calculateScore(state);
            const survivors = state.party.filter(p => p.status !== 'fainted');

            // Use e4EntryParty if available (full party that entered Elite Four)
            const hofTeam = state.e4EntryParty || survivors;
            const aliveNames = state.party.map(p => p.name);

            // Save score
            PT.Engine.Scoring.saveToLeaderboard({
                name: state.trainerName,
                score: score,
                pokedexCount: state.pokedexCaught.length,
                badges: state.badges.length,
                daysElapsed: state.daysElapsed,
                date: new Date().toLocaleDateString(),
                won: true
            });

            const div = document.createElement('div');
            div.className = 'screen victory-screen';
            div.innerHTML = `
                <div class="victory-title">HALL OF FAME</div>
                <div class="text-box text-center" style="font-size: 8px;">
                    Congratulations, ${state.trainerName}!
                    <br>You've reached the Indigo Plateau${state.badges.includes('champion') ? ' and became CHAMPION!' : '!'}
                </div>
                <div class="hall-of-fame-team">
                    ${hofTeam.map(p => {
                        const isAlive = aliveNames.includes(p.name);
                        return `
                        <div class="hof-pokemon" style="${!isAlive ? 'opacity: 0.4;' : ''}">
                            <img class="hof-sprite" src="${p.spriteUrl}" alt="${p.name}"
                                 onerror="this.style.display='none'">
                            <div class="hof-name" style="${!isAlive ? 'text-decoration: line-through;' : ''}">${p.name}</div>
                            ${!isAlive ? '<div style="font-size: 5px;">💀</div>' : ''}
                        </div>
                    `}).join('')}
                </div>
                <div class="score-breakdown" style="font-size: 7px;">
                    ${breakdown.victory ? `<div>Victory Bonus: +${breakdown.victory}</div>` : ''}
                    ${breakdown.champion ? `<div>Champion Bonus: +${breakdown.champion}</div>` : ''}
                    <div>Healthy Pokemon: +${breakdown.healthyPokemon}</div>
                    <div>Speed Bonus: +${breakdown.speedBonus}</div>
                    <div>Pokedex (${state.pokedexCaught.length}): +${breakdown.pokedexCaught}</div>
                    <div>Rare Pokemon: +${breakdown.rarePokemon}</div>
                    ${breakdown.legendaryPokemon > 0 ? `<div>Legendary Pokemon: +${breakdown.legendaryPokemon}</div>` : ''}
                    <div>Gym Badges (${state.badges.filter(b => b !== 'champion').length}): +${breakdown.badges}</div>
                    <div>Team Rocket: +${breakdown.teamRocket}</div>
                    <div>Distance: +${breakdown.distance}</div>
                    <div>Resources: +${breakdown.resources}</div>
                    ${breakdown.penalties < 0 ? `<div>Penalties: ${breakdown.penalties}</div>` : ''}
                    <div class="score-total">FINAL SCORE: ${score.toLocaleString()}</div>
                </div>
                <div class="btn-row" style="width: 100%; max-width: 500px;">
                    <button class="btn flex-1" id="btn-retry">PLAY AGAIN</button>
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
