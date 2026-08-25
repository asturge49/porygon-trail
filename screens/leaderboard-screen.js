// Porygon Trail - Leaderboard Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    const TABS = [
        { key: 'runs', label: 'HIGH SCORE', sub: 'Best 20 individual runs, by score' },
        { key: 'trainers', label: 'TOP TRAINERS', sub: 'Best score per trainer (top 10)' },
        { key: 'pokedex', label: 'POKEDEX %', sub: 'Total Pokedex completion across all runs' },
        { key: 'fastest', label: 'FASTEST WIN', sub: 'Quickest trip to the Indigo Plateau' },
        { key: 'catches', label: 'MOST CATCHES', sub: 'Most Pokemon caught in a single run' },
        { key: 'legendary', label: 'LEGENDARIES', sub: 'Total legendaries caught across all runs', hideBadges: true }
    ];

    let currentMode = 'runs';

    function totalDexCount() {
        return PT.Data.Pokemon.length;
    }

    function statLine(entry, mode) {
        if (mode === 'pokedex') {
            const pct = Math.round((entry.pokedexCount / totalDexCount()) * 100);
            return `${pct}% (${entry.pokedexCount}/${totalDexCount()}) lifetime`;
        }
        if (mode === 'catches') {
            return `${entry.pokedexCount} caught | Day ${entry.daysElapsed}`;
        }
        if (mode === 'legendary') {
            return `${entry.legendaryCount} legendaries lifetime`;
        }
        if (mode === 'fastest') {
            return `Day ${entry.daysElapsed} | ${entry.pokedexCount} caught`;
        }
        return `${entry.pokedexCount} caught | Day ${entry.daysElapsed}`;
    }

    function mainValue(entry, mode) {
        if (mode === 'pokedex') return Math.round((entry.pokedexCount / totalDexCount()) * 100) + '%';
        if (mode === 'catches') return entry.pokedexCount;
        if (mode === 'legendary') return entry.legendaryCount;
        if (mode === 'fastest') return entry.daysElapsed + 'd';
        return entry.score.toLocaleString();
    }

    function renderTable(entries, emptyMsg, mode, hideBadges) {
        if (!entries || entries.length === 0) {
            return `<div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">
                ${emptyMsg}
            </div>`;
        }
        return entries.map((entry, i) => `
            <div class="leaderboard-row ${hideBadges ? 'no-badges' : ''} ${i === 0 ? 'rank-1' : ''} ${entry.inProgress ? 'in-progress' : ''}"
                 style="cursor: pointer;"
                 data-user-id="${entry.userId || ''}"
                 data-username="${entry.name}">
                <span>${i + 1}</span>
                <span>
                    <span>${entry.name}</span>${entry.won ? ' ★' : entry.inProgress ? ' ⏳' : ''}
                    <br><span style="font-size: 6px; color: var(--gb-dark);">${statLine(entry, mode)} | ${entry.inProgress ? 'IN PROGRESS' : entry.date}</span>
                </span>
                <span>${mainValue(entry, mode)}</span>
                ${hideBadges ? '' : `<span>${entry.badges || 0}</span>`}
            </div>
        `).join('');
    }

    function renderScreen(container) {
        const API = PT.Engine.LeaderboardAPI;
        const globalAvailable = API.isGlobalEnabled();
        const activeTab = TABS.find(t => t.key === currentMode);

        const div = document.createElement('div');
        div.className = 'screen leaderboard-screen';
        div.innerHTML = `
            <div class="leaderboard-title">TOP TRAINERS</div>

            ${globalAvailable ? `
            <div class="leaderboard-tabs">
                ${TABS.map(t => `<button class="leaderboard-tab ${currentMode === t.key ? 'active' : ''}" data-tab="${t.key}">${t.label}</button>`).join('')}
            </div>
            <div style="font-size: 6px; color: var(--gb-dark); text-align: center; margin-bottom: 4px;">
                ${activeTab.sub}
            </div>
            ` : ''}

            <div class="leaderboard-table">
                <div class="leaderboard-row header ${activeTab.hideBadges ? 'no-badges' : ''}">
                    <span>#</span>
                    <span>TRAINER</span>
                    <span>${currentMode === 'runs' || currentMode === 'trainers' ? 'SCORE' : currentMode === 'pokedex' ? 'DEX %' : currentMode === 'catches' ? 'CAUGHT' : currentMode === 'legendary' ? 'LEGEND' : 'DAYS'}</span>
                    ${activeTab.hideBadges ? '' : '<span>BADGES</span>'}
                </div>
                <div id="leaderboard-body">
                    <div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">Loading...</div>
                </div>
            </div>

            <div style="font-size: 6px; color: var(--gb-dark); padding: 4px; text-align: center;">
                ★ = Reached Indigo Plateau &nbsp;|&nbsp; ⏳ = Run still in progress
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
                body.innerHTML = renderTable([], 'Sign in to see the global leaderboard!', currentMode);
                return;
            }

            const fetchers = {
                runs: () => API.getGlobalLeaderboard(),
                trainers: () => API.getTopTrainers(),
                pokedex: () => API.getDexCompletionLeaderboard(),
                catches: () => API.getMostCatchesLeaderboard(),
                fastest: () => API.getFastestWinLeaderboard(),
                legendary: () => API.getLegendaryLeaderboard()
            };

            const emptyMsgs = {
                runs: 'No runs yet!<br>Be the first on the trail!',
                trainers: 'No trainers yet!<br>Complete a run to appear here!',
                pokedex: 'No runs yet!<br>Catch some Pokemon to appear here!',
                catches: 'No runs yet!<br>Catch some Pokemon to appear here!',
                fastest: 'No wins yet!<br>Reach the Indigo Plateau to appear here!',
                legendary: 'No legendaries caught yet!'
            };

            fetchers[currentMode]().then(entries => {
                if (!document.getElementById('leaderboard-body')) return;
                document.getElementById('leaderboard-body').innerHTML =
                    entries === null
                        ? '<div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">Could not load scores.</div>'
                        : renderTable(entries, emptyMsgs[currentMode], currentMode, activeTab.hideBadges);
                attachRowClicks();
            }).catch(() => {
                const b = document.getElementById('leaderboard-body');
                if (b) b.innerHTML = '<div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">Could not load scores.</div>';
            });
        }

        // Tab toggle
        if (globalAvailable) {
            document.querySelectorAll('.leaderboard-tab').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (currentMode === btn.dataset.tab) return;
                    currentMode = btn.dataset.tab;
                    PT.App.goto('LEADERBOARD');
                });
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
