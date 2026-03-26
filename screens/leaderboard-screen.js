// Porygon Trail - Leaderboard Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    let currentTab = 'personal'; // 'personal' or 'global'

    function renderTable(entries, emptyMsg) {
        if (!entries || entries.length === 0) {
            return `<div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">
                ${emptyMsg}
            </div>`;
        }
        return entries.map((entry, i) => `
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
        `).join('');
    }

    function renderScreen(container) {
        const API = PT.Engine.LeaderboardAPI;
        const globalAvailable = API.isGlobalEnabled();
        const personalEntries = API.getLocalLeaderboard();

        const div = document.createElement('div');
        div.className = 'screen leaderboard-screen';
        div.innerHTML = `
            <div class="leaderboard-title">TOP TRAINERS</div>
            ${globalAvailable ? `
            <div class="leaderboard-tabs">
                <button class="leaderboard-tab ${currentTab === 'personal' ? 'active' : ''}" id="tab-personal">PERSONAL</button>
                <button class="leaderboard-tab ${currentTab === 'global' ? 'active' : ''}" id="tab-global">GLOBAL</button>
            </div>
            ` : ''}
            <div class="leaderboard-table">
                <div class="leaderboard-row header">
                    <span>#</span>
                    <span>TRAINER</span>
                    <span>SCORE</span>
                    <span>BADGES</span>
                </div>
                <div id="leaderboard-body">
                    ${currentTab === 'personal'
                        ? renderTable(personalEntries, 'No scores yet!<br>Be the first to attempt the Porygon Trail!')
                        : '<div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">Loading...</div>'
                    }
                </div>
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

        // Tab switching
        if (globalAvailable) {
            document.getElementById('tab-personal').addEventListener('click', () => {
                currentTab = 'personal';
                PT.App.goto('LEADERBOARD');
            });
            document.getElementById('tab-global').addEventListener('click', () => {
                currentTab = 'global';
                PT.App.goto('LEADERBOARD');
            });

            // If global tab is active, fetch async
            if (currentTab === 'global') {
                API.getGlobalLeaderboard().then(entries => {
                    const body = document.getElementById('leaderboard-body');
                    if (body) {
                        body.innerHTML = renderTable(
                            entries,
                            'No global scores yet!<br>Be the first to set a worldwide record!'
                        );
                    }
                }).catch(() => {
                    const body = document.getElementById('leaderboard-body');
                    if (body) {
                        body.innerHTML = '<div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">Could not load global scores.</div>';
                    }
                });
            }
        }

        document.getElementById('btn-back').addEventListener('click', () => {
            currentTab = 'personal';
            PT.App.goto('TITLE');
        });
        document.getElementById('btn-clear').addEventListener('click', () => {
            if (currentTab === 'personal') {
                API.clearLocal();
            }
            PT.App.goto('LEADERBOARD');
        });
    }

    PT.Screens.LEADERBOARD = {
        render: renderScreen
    };
})();
