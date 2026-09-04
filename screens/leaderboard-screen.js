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
        { key: 'legendary', label: 'LEGENDARIES', sub: 'Total legendaries caught across all runs', hideBadges: true },
        { key: 'champions', label: 'CHAMPIONS', sub: 'Total Pokemon champion-tagged across all wins', hideBadges: true },
        { key: 'e4wins', label: 'E4 WINS', sub: 'Total Elite Four wins across all runs', hideBadges: true },
        { key: 'redwins', label: 'RED WINS', sub: 'Total Red (Mt. Silver) wins across all runs', hideBadges: true }
    ];

    let currentMode = 'runs';

    // §13.2 leaderboard toggle — only these row-based tabs are per-run and thus
    // have a meaningful Johto view (johto_score/johto_badges/johto_days_elapsed/
    // johto_pokedex_count, all nullable on a Kanto-only run — see
    // supabase/schema.sql and engine/leaderboard-api.js). The lifetime/RPC-based
    // tabs (pokedex %, legendaries, champions) aggregate across ALL of a
    // trainer's runs and don't have a region split in the schema, so the toggle
    // doesn't apply to them.
    //
    // e4wins is also a lifetime aggregate, but IS in this list — its RPC
    // returns both a kanto_e4_wins and johto_e4_wins count per trainer in one
    // query, so the toggle here just picks/sorts by whichever count matches
    // the region client-side (see the entries.filter/.sort in loadEntries)
    // rather than changing what gets fetched, unlike the other row-based
    // tabs where the region drives the actual server-side query.
    const REGION_TOGGLE_TABS = ['runs', 'trainers', 'catches', 'fastest', 'e4wins'];
    // 'all' (every run, combined) is the default view; 'kanto' now means
    // only runs that never continued into Johto, 'johto' only ones that did.
    let currentRegion = 'all';

    function totalDexCount() {
        return PT.Data.Pokemon.length;
    }

    // Region-aware field pickers — fall back to the Kanto field name when not
    // in the Johto view, so callers don't need an if/else at every call site.
    function fieldFor(entry, region, kantoKey, johtoKey) {
        return region === 'johto' ? entry[johtoKey] : entry[kantoKey];
    }

    function statLine(entry, mode, region) {
        if (mode === 'pokedex') {
            const pct = Math.round((entry.pokedexCount / totalDexCount()) * 100);
            return `${pct}% (${entry.pokedexCount}/${totalDexCount()}) lifetime`;
        }
        if (mode === 'catches') {
            const caught = fieldFor(entry, region, 'pokedexCount', 'johtoPokedexCount');
            return `${caught} caught | Day ${entry.daysElapsed}`;
        }
        if (mode === 'legendary') {
            return `${entry.legendaryCount} legendaries lifetime`;
        }
        if (mode === 'champions') {
            return `${entry.championCount} champions lifetime`;
        }
        if (mode === 'e4wins') {
            return `${entry.kantoE4Wins} Kanto / ${entry.johtoE4Wins} Johto lifetime`;
        }
        if (mode === 'redwins') {
            return `${entry.redWins} lifetime | Day ${entry.daysElapsed} fastest`;
        }
        if (mode === 'fastest') {
            const days = fieldFor(entry, region, 'daysElapsed', 'johtoDaysElapsed');
            const caught = fieldFor(entry, region, 'pokedexCount', 'johtoPokedexCount');
            return `Day ${days} | ${caught} caught`;
        }
        const caught = fieldFor(entry, region, 'pokedexCount', 'johtoPokedexCount');
        return `${caught} caught | Day ${entry.daysElapsed}`;
    }

    function mainValue(entry, mode, region) {
        if (mode === 'pokedex') return Math.round((entry.pokedexCount / totalDexCount()) * 100) + '%';
        if (mode === 'catches') return fieldFor(entry, region, 'pokedexCount', 'johtoPokedexCount');
        if (mode === 'legendary') return entry.legendaryCount;
        if (mode === 'champions') return entry.championCount;
        if (mode === 'e4wins') {
            if (region === 'johto') return entry.johtoE4Wins;
            if (region === 'kanto') return entry.kantoE4Wins;
            return entry.kantoE4Wins + entry.johtoE4Wins;
        }
        if (mode === 'redwins') return entry.redWins;
        if (mode === 'fastest') return fieldFor(entry, region, 'daysElapsed', 'johtoDaysElapsed') + 'd';
        return (fieldFor(entry, region, 'score', 'johtoScore') || 0).toLocaleString();
    }

    function renderTable(entries, emptyMsg, mode, hideBadges, region) {
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
                    <span>${entry.name}</span>${(entry.kantoE4Cleared !== undefined ? entry.kantoE4Cleared : entry.won) ? ' ★' : entry.inProgress ? ' ⏳' : ''}${entry.difficultyLevel ? ` <span style="font-size: 6px; color: var(--gb-dark);">LV${entry.difficultyLevel}</span>` : ''}
                    <br><span style="font-size: 6px; color: var(--gb-dark);">${statLine(entry, mode, region)} | ${entry.inProgress ? 'IN PROGRESS' : entry.date}</span>
                </span>
                <span>${mainValue(entry, mode, region)}</span>
                ${hideBadges ? '' : `<span>${(region === 'johto' ? entry.johtoBadges : entry.badges) || 0}</span>`}
            </div>
        `).join('');
    }

    function renderScreen(container) {
        const API = PT.Engine.LeaderboardAPI;
        const globalAvailable = API.isGlobalEnabled();
        const activeTab = TABS.find(t => t.key === currentMode);
        const regionToggleApplies = REGION_TOGGLE_TABS.includes(currentMode);

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
            ${regionToggleApplies ? `
            <div class="leaderboard-region-toggle">
                <button class="leaderboard-tab ${currentRegion === 'all' ? 'active' : ''}" data-region="all">ALL</button>
                <div class="leaderboard-region-split">
                    <button class="leaderboard-tab ${currentRegion === 'kanto' ? 'active' : ''}" data-region="kanto">KANTO</button>
                    <button class="leaderboard-tab ${currentRegion === 'johto' ? 'active' : ''}" data-region="johto">JOHTO</button>
                </div>
            </div>
            ` : ''}
            ` : ''}

            <div class="leaderboard-table">
                <div class="leaderboard-row header ${activeTab.hideBadges ? 'no-badges' : ''}">
                    <span>#</span>
                    <span>TRAINER</span>
                    <span>${currentMode === 'runs' || currentMode === 'trainers' ? 'SCORE' : currentMode === 'pokedex' ? 'DEX %' : currentMode === 'catches' ? 'CAUGHT' : currentMode === 'legendary' ? 'LEGEND' : currentMode === 'champions' ? 'CHAMPS' : currentMode === 'e4wins' || currentMode === 'redwins' ? 'WINS' : 'DAYS'}</span>
                    ${activeTab.hideBadges ? '' : '<span>BADGES</span>'}
                </div>
                <div id="leaderboard-body">
                    <div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">Loading...</div>
                </div>
            </div>

            <div style="font-size: 6px; color: var(--gb-dark); padding: 4px; text-align: center;">
                ★ = Beat the Kanto Elite Four &nbsp;|&nbsp; ⏳ = Run still in progress
                ${['runs', 'trainers', 'catches', 'fastest'].includes(currentMode) ? '&nbsp;|&nbsp; LVx = Difficulty level the run was played at' : ''}
                ${regionToggleApplies
                    ? (currentMode === 'e4wins'
                        ? '<br>KANTO/JOHTO = lifetime wins of that Elite Four &nbsp;|&nbsp; ALL = combined'
                        : '<br>KANTO = never reached Johto &nbsp;|&nbsp; JOHTO = only runs that did')
                    : ''}
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

            // Only the row-based tabs (REGION_TOGGLE_TABS) take a region arg —
            // the lifetime/RPC-based ones ignore any extra argument.
            const fetchers = {
                runs: () => API.getGlobalLeaderboard(currentRegion),
                trainers: () => API.getTopTrainers(currentRegion),
                pokedex: () => API.getDexCompletionLeaderboard(),
                catches: () => API.getMostCatchesLeaderboard(currentRegion),
                fastest: () => API.getFastestWinLeaderboard(currentRegion),
                legendary: () => API.getLegendaryLeaderboard(),
                champions: () => API.getChampionLeaderboard(),
                e4wins: () => API.getE4WinsLeaderboard(),
                redwins: () => API.getRedWinsLeaderboard()
            };

            const emptyMsgs = {
                runs: 'No runs yet!<br>Be the first on the trail!',
                trainers: 'No trainers yet!<br>Complete a run to appear here!',
                pokedex: 'No runs yet!<br>Catch some Pokemon to appear here!',
                catches: 'No runs yet!<br>Catch some Pokemon to appear here!',
                fastest: 'No wins yet!<br>Reach the Indigo Plateau to appear here!',
                legendary: 'No legendaries caught yet!',
                champions: 'No champions yet!<br>Win a run to crown your team!',
                e4wins: 'No Elite Four wins yet!<br>Beat the Elite Four to appear here!',
                redwins: 'No Red wins yet!<br>Defeat Red at Mt. Silver to appear here!'
            };

            const region = regionToggleApplies ? currentRegion : null;
            fetchers[currentMode]().then(entries => {
                if (!document.getElementById('leaderboard-body')) return;
                // e4wins fetches one combined dataset regardless of region (its
                // RPC has no server-side region split) — the toggle only picks
                // which count to sort/show, so re-sort and drop zero-count
                // entries for the selected view here, client-side.
                if (entries && currentMode === 'e4wins') {
                    const valueFor = e => region === 'johto' ? e.johtoE4Wins : region === 'kanto' ? e.kantoE4Wins : (e.kantoE4Wins + e.johtoE4Wins);
                    entries = entries.filter(e => valueFor(e) > 0).sort((a, b) => valueFor(b) - valueFor(a));
                }
                document.getElementById('leaderboard-body').innerHTML =
                    entries === null
                        ? '<div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">Could not load scores.</div>'
                        : renderTable(entries, emptyMsgs[currentMode], currentMode, activeTab.hideBadges, region);
                attachRowClicks();
            }).catch(() => {
                const b = document.getElementById('leaderboard-body');
                if (b) b.innerHTML = '<div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">Could not load scores.</div>';
            });
        }

        // Tab toggle
        if (globalAvailable) {
            document.querySelectorAll('.leaderboard-tab[data-tab]').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (currentMode === btn.dataset.tab) return;
                    currentMode = btn.dataset.tab;
                    // Landing on a tab that doesn't support the region toggle
                    // (pokedex/legendary/champions) always shows lifetime
                    // data — reset so a later return to a toggle-able tab
                    // doesn't strand the view on Kanto/Johto silently.
                    if (!REGION_TOGGLE_TABS.includes(currentMode)) currentRegion = 'all';
                    PT.App.goto('LEADERBOARD');
                });
            });

            // Region toggle (§13.2)
            document.querySelectorAll('.leaderboard-tab[data-region]').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (currentRegion === btn.dataset.region) return;
                    currentRegion = btn.dataset.region;
                    PT.App.goto('LEADERBOARD');
                });
            });
        }

        document.getElementById('btn-back').addEventListener('click', () => {
            if (PT.App.screenStack.length > 0) {
                PT.App.pop();
            } else {
                PT.App.goto('TITLE');
            }
        });

        loadEntries();
    }

    PT.Screens.LEADERBOARD = {
        render: renderScreen
    };
})();
