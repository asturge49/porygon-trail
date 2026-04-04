// Porygon Trail - Leaderboard Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // 'runs' = top 20 individual runs | 'trainers' = top 10 users by best score
    let currentMode = 'runs';

    function renderTable(entries, emptyMsg) {
        if (!entries || entries.length === 0) {
            return `<div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">
                ${emptyMsg}
            </div>`;
        }
        return entries.map((entry, i) => `
            <div class="leaderboard-row ${i === 0 ? 'rank-1' : ''}"
                 style="cursor: pointer;"
                 data-user-id="${entry.userId || ''}"
                 data-username="${entry.name}">
                <span>${i + 1}</span>
                <span>
                    <span style="text-decoration: underline; text-underline-offset: 2px;">${entry.name}</span>${entry.won ? ' ★' : ''}
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

        const div = document.createElement('div');
        div.className = 'screen leaderboard-screen';
        div.innerHTML = `
            <div class="leaderboard-title">TOP TRAINERS</div>

            ${globalAvailable ? `
            <div class="leaderboard-tabs">
                <button class="leaderboard-tab ${currentMode === 'runs' ? 'active' : ''}" id="tab-runs">TOP RUNS</button>
                <button class="leaderboard-tab ${currentMode === 'trainers' ? 'active' : ''}" id="tab-trainers">TOP TRAINERS</button>
            </div>
            <div style="font-size: 6px; color: var(--gb-dark); text-align: center; margin-bottom: 4px;">
                ${currentMode === 'runs' ? 'Best 20 individual runs' : 'Best score per trainer (top 10)'}
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
                    <div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">Loading...</div>
                </div>
            </div>

            <div style="font-size: 6px; color: var(--gb-dark); padding: 4px; text-align: center;">
                ★ = Reached Indigo Plateau
            </div>
            <div class="btn-row">
                <button class="btn flex-1" id="btn-back">BACK</button>
            </div>
        `;
        container.appendChild(div);

        function attachRowClicks() {
            document.querySelectorAll('.leaderboard-row[data-user-id]').forEach(row => {
                const userId = row.dataset.userId;
                const username = row.dataset.username;
                if (!userId) return;
                row.addEventListener('click', () => {
                    PT.App.goto('PROFILE', { userId, username });
                });
            });
        }

        // Fetch and render the current mode
        function loadEntries() {
            const body = document.getElementById('leaderboard-body');
            if (!body) return;

            if (!globalAvailable) {
                body.innerHTML = renderTable([], 'Sign in to see the global leaderboard!');
                return;
            }

            const fetch = currentMode === 'runs'
                ? API.getGlobalLeaderboard()
                : API.getTopTrainers();

            const emptyMsg = currentMode === 'runs'
                ? 'No runs yet!<br>Be the first on the trail!'
                : 'No trainers yet!<br>Complete a run to appear here!';

            fetch.then(entries => {
                if (!document.getElementById('leaderboard-body')) return;
                document.getElementById('leaderboard-body').innerHTML =
                    entries === null
                        ? '<div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">Could not load scores.</div>'
                        : renderTable(entries, emptyMsg);
                attachRowClicks();
            }).catch(() => {
                const b = document.getElementById('leaderboard-body');
                if (b) b.innerHTML = '<div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">Could not load scores.</div>';
            });
        }

        // Tab toggle
        if (globalAvailable) {
            document.getElementById('tab-runs').addEventListener('click', () => {
                if (currentMode === 'runs') return;
                currentMode = 'runs';
                PT.App.goto('LEADERBOARD');
            });
            document.getElementById('tab-trainers').addEventListener('click', () => {
                if (currentMode === 'trainers') return;
                currentMode = 'trainers';
                PT.App.goto('LEADERBOARD');
            });
        }

        document.getElementById('btn-back').addEventListener('click', () => {
            PT.App.goto('TITLE');
        });

        loadEntries();
    }

    PT.Screens.LEADERBOARD = {
        render: renderScreen
    };
})();
