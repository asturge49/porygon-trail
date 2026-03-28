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
            const graveyard = state.graveyard || [];

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
                won: true
            });

            // Star display helper
            function starStr(stars) {
                if (!stars) return '';
                return ' ' + '★'.repeat(stars);
            }

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
                        const stars = p.battleStars || 0;
                        return `
                        <div class="hof-pokemon" style="${!isAlive ? 'opacity: 0.4;' : ''}">
                            <img class="hof-sprite" src="${p.spriteUrl}" alt="${p.name}"
                                 onerror="this.style.display='none'">
                            <div class="hof-name" style="${!isAlive ? 'text-decoration: line-through;' : ''}">${p.name}</div>
                            ${stars > 0 ? `<div style="font-size: 6px; color: #b8860b;">${'★'.repeat(stars)}</div>` : ''}
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
                <div id="fallen-log" style="display: none; margin-top: 8px;">
                    <div class="text-box" style="font-size: 7px; max-height: 120px; overflow-y: auto;">
                        <div style="font-weight: bold; margin-bottom: 4px; text-align: center;">💀 FALLEN POKEMON 💀</div>
                        ${graveyard.length === 0
                            ? '<div style="text-align: center; color: var(--gb-dark);">No Pokemon were lost. Incredible!</div>'
                            : graveyard.map(g => `
                                <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 3px; padding: 2px; border-bottom: 1px solid var(--gb-dark);">
                                    <img src="${g.spriteUrl}" alt="${g.name}" style="width: 24px; height: 24px; image-rendering: pixelated;"
                                         onerror="this.style.display='none'">
                                    <div style="flex: 1;">
                                        <span style="font-weight: bold;">${g.name}</span>${g.battleStars > 0 ? ` <span style="color: #b8860b;">${'★'.repeat(g.battleStars)}</span>` : ''}
                                        <br><span style="font-size: 6px; color: var(--gb-dark);">Lost at ${g.location} — Day ${g.day}</span>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
                <div class="btn-row" style="width: 100%; max-width: 500px;">
                    <button class="btn flex-1" id="btn-fallen">${graveyard.length > 0 ? `FALLEN (${graveyard.length})` : 'FALLEN'}</button>
                    <button class="btn flex-1" id="btn-leaderboard">LEADERBOARD</button>
                </div>
                <div class="btn-row" style="width: 100%; max-width: 500px; margin-top: 4px;">
                    <button class="btn flex-1" id="btn-retry">PLAY AGAIN</button>
                    <button class="btn flex-1" id="btn-main-menu">MAIN MENU</button>
                </div>
            `;
            container.appendChild(div);

            // Toggle fallen log
            document.getElementById('btn-fallen').addEventListener('click', () => {
                const log = document.getElementById('fallen-log');
                log.style.display = log.style.display === 'none' ? 'block' : 'none';
            });

            document.getElementById('btn-retry').addEventListener('click', () => {
                PT.State = null;
                PT.App.goto('TITLE');
            });
            document.getElementById('btn-main-menu').addEventListener('click', () => {
                PT.State = null;
                PT.App.goto('TITLE');
            });
            document.getElementById('btn-leaderboard').addEventListener('click', () => {
                PT.App.goto('LEADERBOARD');
            });
        }
    };
})();
