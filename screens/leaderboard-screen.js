// Porygon Trail - Leaderboard Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.LEADERBOARD = {
        render(container) {
            const leaderboard = PT.Engine.Scoring.getLeaderboard();

            const div = document.createElement('div');
            div.className = 'screen leaderboard-screen';
            div.innerHTML = `
                <div class="leaderboard-title">TOP TRAINERS</div>
                <div class="leaderboard-table">
                    <div class="leaderboard-row header">
                        <span>#</span>
                        <span>TRAINER</span>
                        <span>SCORE</span>
                        <span>BADGES</span>
                    </div>
                    ${leaderboard.length === 0 ? `
                        <div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">
                            No scores yet!<br>Be the first to attempt the Porygon Trail!
                        </div>
                    ` : leaderboard.map((entry, i) => `
                        <div class="leaderboard-row ${i === 0 ? 'rank-1' : ''}">
                            <span>${i + 1}</span>
                            <span>
                                ${entry.name}
                                ${entry.won ? ' *' : ''}
                                <br><span style="font-size: 6px; color: var(--gb-dark);">${entry.pokedexCount} caught | Day ${entry.daysElapsed} | ${entry.date}</span>
                            </span>
                            <span>${entry.score.toLocaleString()}</span>
                            <span>${entry.badges || 0}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="font-size: 6px; color: var(--gb-dark); padding: 4px; text-align: center;">
                    * = Reached Indigo Plateau
                </div>
                <div class="btn-row">
                    <button class="btn flex-1" id="btn-back">BACK</button>
                    <button class="btn flex-1 btn-small" id="btn-clear">CLEAR SCORES</button>
                </div>
            `;
            container.appendChild(div);

            document.getElementById('btn-back').addEventListener('click', () => {
                PT.App.goto('TITLE');
            });

            document.getElementById('btn-clear').addEventListener('click', () => {
                PT.Engine.Scoring.clearLeaderboard();
                PT.App.goto('LEADERBOARD');
            });
        }
    };
})();
