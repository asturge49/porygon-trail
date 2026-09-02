// Porygon Trail - Ops Dex
// Read-only internal reporting dashboard. Queries the PRODUCTION Supabase project
// directly with the public anon key (same key already shipped in engine/config.js) —
// pt_leaderboard, pt_profiles and pt_events all carry "select using (true)" RLS
// policies (see supabase/schema.sql), so no service-role secret is needed here.
// Static site, no build step, matches the main game's conventions.
(function() {
    const SUPABASE_URL = 'https://anxkyksrmvtsmhdaktrq.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueGt5a3NybXZ0c21oZGFrdHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTMxODksImV4cCI6MjEwMzE4OTE4OX0.U2QcSjNMGqRvg82rbG1oHrQOr-i_Lfb-oeBLRJmP-2k';

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const CHART_COLORS = ['#33ff8c', '#ffb020', '#d21a1a', '#7fe6ff', '#c78bff', '#ff8bcb', '#6ba585'];

    // Progression order of every location, id/name/region only (mirrors data/routes.js
    // array order 1:1 — index here === state.currentLocationIndex === payload.route_index
    // in a game_over event). Kept as a compact copy rather than loading the full
    // routes.js (which also carries encounter tables/event pools this dashboard has
    // no use for) — this project's Vercel deploy root is dashboard/, so a file outside
    // it isn't reachable at runtime anyway.
    const ROUTE_ORDER = [
        ["pallet_town", "Pallet Town", "kanto"], ["route_1", "Route 1", "kanto"],
        ["viridian_city", "Viridian City", "kanto"], ["viridian_forest", "Viridian Forest", "kanto"],
        ["pewter_city", "Pewter City", "kanto"], ["mt_moon", "Mt. Moon", "kanto"],
        ["cerulean_city", "Cerulean City", "kanto"], ["route_5", "Route 5", "kanto"],
        ["route_6", "Route 6", "kanto"], ["vermilion_city", "Vermilion City", "kanto"],
        ["route_8", "Route 8", "kanto"], ["rock_tunnel", "Rock Tunnel", "kanto"],
        ["lavender_town", "Lavender Town", "kanto"], ["route_8_celadon", "Route 7", "kanto"],
        ["celadon_city", "Celadon City", "kanto"], ["saffron_city", "Saffron City", "kanto"],
        ["cycling_road", "Cycling Road", "kanto"], ["fuchsia_city", "Fuchsia City", "kanto"],
        ["sea_route_19", "Sea Route 19", "kanto"], ["sea_route_20", "Sea Route 20", "kanto"],
        ["seafoam_islands", "Seafoam Islands", "kanto"], ["cinnabar_island", "Cinnabar Island", "kanto"],
        ["route_21", "Route 21", "kanto"], ["viridian_city_return", "Viridian City (Return Trip)", "kanto"],
        ["route_22", "Route 22", "kanto"], ["route_23", "Route 23", "kanto"],
        ["victory_road", "Victory Road", "kanto"], ["indigo_plateau", "Indigo Plateau", "kanto"],
        ["pokemon_league", "Pokemon League (Kanto E4)", "kanto"],
        ["new_bark_town", "New Bark Town", "johto"], ["route_29", "Route 29", "johto"],
        ["cherrygrove_city", "Cherrygrove City", "johto"], ["route_30", "Route 30", "johto"],
        ["route_31", "Route 31", "johto"], ["violet_city", "Violet City", "johto"],
        ["route_32", "Route 32", "johto"], ["union_cave", "Union Cave", "johto"],
        ["route_33", "Route 33", "johto"], ["azalea_town", "Azalea Town", "johto"],
        ["slowpoke_well", "Slowpoke Well", "johto"], ["route_34", "Route 34", "johto"],
        ["goldenrod_city", "Goldenrod City", "johto"], ["route_35", "Route 35", "johto"],
        ["national_park", "National Park", "johto"], ["route_36", "Route 36", "johto"],
        ["route_37", "Route 37", "johto"], ["ecruteak_city", "Ecruteak City", "johto"],
        ["route_38", "Route 38", "johto"], ["route_39", "Route 39", "johto"],
        ["olivine_city", "Olivine City", "johto"], ["route_40", "Route 40", "johto"],
        ["route_41", "Route 41", "johto"], ["cianwood_city", "Cianwood City", "johto"],
        ["route_42", "Route 42", "johto"], ["mt_mortar", "Mt. Mortar", "johto"],
        ["mahogany_town", "Mahogany Town", "johto"], ["lake_of_rage", "Lake of Rage", "johto"],
        ["route_44", "Route 44", "johto"], ["ice_path", "Ice Path", "johto"],
        ["blackthorn_city", "Blackthorn City", "johto"], ["dragons_den", "Dragon's Den", "johto"],
        ["victory_road_johto", "Victory Road (Johto)", "johto"],
        ["indigo_plateau_johto", "Indigo Plateau (Johto E4)", "johto"],
        ["route_28_mt_silver", "Route 28 / Mt. Silver", "johto"]
    ].map(([id, name, region]) => ({ id, name, region }));

    const app = document.getElementById('app');
    const refreshEl = document.getElementById('last-refresh');

    // Fetches every row of a table page-by-page (Supabase REST caps at 1000/request).
    async function fetchAll(table, columns) {
        const PAGE = 1000;
        let from = 0;
        let rows = [];
        while (true) {
            const { data, error } = await client.from(table).select(columns).range(from, from + PAGE - 1);
            if (error) throw new Error(`${table}: ${error.message}`);
            rows = rows.concat(data);
            if (data.length < PAGE) break;
            from += PAGE;
        }
        return rows;
    }

    function pct(n, d) {
        if (!d) return '0%';
        return `${Math.round((n / d) * 100)}%`;
    }

    function avg(nums) {
        if (!nums.length) return 0;
        return nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    function dayKey(dateStr) {
        return new Date(dateStr).toISOString().slice(0, 10);
    }

    function statCard(label, value, cls) {
        return `<div class="stat-card">
            <div class="stat-label">${label}</div>
            <div class="stat-value${cls ? ' ' + cls : ''}">${value}</div>
        </div>`;
    }

    function buildLineChart(canvasId, labels, series) {
        return new Chart(document.getElementById(canvasId), {
            type: 'line',
            data: { labels, datasets: series },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: '#c9ffdd', font: { family: 'VT323', size: 14 } } } },
                scales: {
                    x: { ticks: { color: '#6ba585' }, grid: { color: '#1d4a2c' } },
                    y: { ticks: { color: '#6ba585' }, grid: { color: '#1d4a2c' }, beginAtZero: true }
                }
            }
        });
    }

    function buildBarChart(canvasId, labels, data, label) {
        new Chart(document.getElementById(canvasId), {
            type: 'bar',
            data: {
                labels,
                datasets: [{ label, data, backgroundColor: CHART_COLORS }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#6ba585' }, grid: { display: false } },
                    y: { ticks: { color: '#6ba585' }, grid: { color: '#1d4a2c' }, beginAtZero: true }
                }
            }
        });
    }

    function buildHBarChart(canvasId, labels, data, label, xStepSize) {
        return new Chart(document.getElementById(canvasId), {
            type: 'bar',
            data: {
                labels,
                datasets: [{ label, data, backgroundColor: CHART_COLORS[0] }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#6ba585', stepSize: xStepSize }, grid: { color: '#1d4a2c' }, beginAtZero: true },
                    y: { ticks: { color: '#6ba585' }, grid: { display: false } }
                }
            }
        });
    }

    function buildDoughnut(canvasId, labels, data) {
        new Chart(document.getElementById(canvasId), {
            type: 'doughnut',
            data: { labels, datasets: [{ data, backgroundColor: CHART_COLORS }] },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom', labels: { color: '#c9ffdd', font: { family: 'VT323', size: 14 } } } }
            }
        });
    }

    function topN(counts, n) {
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n);
    }

    function allSorted(counts) {
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }

    // Height (px) for a horizontal bar chart tall enough to fit every row legibly.
    function tallChartHeight(rowCount) {
        return Math.max(280, rowCount * 20);
    }

    const SEE_MORE_STEP = 10;

    // Wires a "See More" button that reveals SEE_MORE_STEP more rows of a horizontal
    // bar chart per click, growing its container to match. entries is the FULL
    // [label, value] list; the chart itself is created already showing the first page.
    function setupSeeMore(btnId, wrapId, chart, entries) {
        const btn = document.getElementById(btnId);
        const wrap = document.getElementById(wrapId);
        if (!btn) return;
        if (entries.length <= SEE_MORE_STEP) {
            btn.style.display = 'none';
            return;
        }
        let shown = SEE_MORE_STEP;
        btn.addEventListener('click', () => {
            shown = Math.min(entries.length, shown + SEE_MORE_STEP);
            const page = entries.slice(0, shown);
            chart.data.labels = page.map(x => x[0]);
            chart.data.datasets[0].data = page.map(x => x[1]);
            wrap.style.height = `${tallChartHeight(shown)}px`;
            chart.resize();
            chart.update();
            if (shown >= entries.length) {
                btn.textContent = 'ALL TRAINERS SHOWN';
                btn.disabled = true;
            } else {
                btn.textContent = `SEE MORE ▼ (${shown}/${entries.length})`;
            }
        });
        btn.textContent = `SEE MORE ▼ (${shown}/${entries.length})`;
    }

    // Wires the day-range toggle buttons (7d/30d) for a line chart, re-slicing from
    // the FULL (unsliced) day-labels/values arrays.
    function setupRangeToggle(groupSelector, chart, fullLabels, fullData) {
        const buttons = document.querySelectorAll(`${groupSelector} .range-btn`);
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const range = parseInt(btn.dataset.range, 10);
                chart.data.labels = fullLabels.slice(-range);
                chart.data.datasets[0].data = fullData.slice(-range);
                chart.update();
            });
        });
    }

    // Each session_heartbeat fires every HEARTBEAT_MS (30s) while the tab is
    // foregrounded — see engine/telemetry.js. So 1 heartbeat = 0.5 minutes.
    const MINUTES_PER_HEARTBEAT = 30000 / 60000;

    function render(profiles, leaderboard, events) {
        const profilesCount = profiles.length;
        const usernameById = {};
        profiles.forEach(p => { usernameById[p.id] = p.username; });
        const nameFor = (userId) => usernameById[userId] || (userId ? `Unknown (${userId.slice(0, 8)})` : 'Unknown');

        const totalRuns = leaderboard.length;
        const completedRuns = leaderboard.filter(r => r.status !== 'in_progress');
        const wins = leaderboard.filter(r => r.won).length;
        const e4Clears = leaderboard.filter(r => r.kanto_e4_cleared).length;
        const johtoEntries = leaderboard.filter(r => r.johto_completed === true).length;

        // ----- Red capstone battle: challenged vs. won -----
        // capstone_result fires exactly once per run that reaches Red and resolves
        // the fight — red_mons_defeated === 6 on a full clear (see
        // screens/red-capstone-screen.js), anything less on a party-wipe loss.
        const capstoneResults = events.filter(e => e.event_type === 'capstone_result');
        const redChallenges = capstoneResults.length;
        const redWins = capstoneResults.filter(e => e.payload && e.payload.red_mons_defeated === 6).length;

        // ----- Runs per day (last 30 days with data) -----
        // Bucketed by created_at, not the `date` column — that's a locale-formatted
        // string (e.g. "29/8/2026" vs "29.08.2026" for the same day) and fragments
        // a single day across multiple labels.
        const runsByDay = {};
        leaderboard.forEach(r => {
            const k = dayKey(r.created_at);
            runsByDay[k] = (runsByDay[k] || 0) + 1;
        });
        const dayLabels = Object.keys(runsByDay).sort().slice(-30);
        const dayCounts = dayLabels.map(d => runsByDay[d]);

        // ----- Starter popularity (from game_start events) -----
        const starterCounts = {};
        events.filter(e => e.event_type === 'game_start').forEach(e => {
            const name = (e.payload && e.payload.starter_name) || 'Unknown';
            starterCounts[name] = (starterCounts[name] || 0) + 1;
        });
        const starterTop = topN(starterCounts, 8);

        // ----- Game over reasons -----
        const reasonCounts = {};
        events.filter(e => e.event_type === 'game_over').forEach(e => {
            const reason = (e.payload && e.payload.reason) || 'unknown';
            reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
        });

        // ----- Score buckets -----
        const buckets = [0, 200, 400, 600, 800, 1000, 1500, 2000];
        const bucketLabels = buckets.map((b, i) => i < buckets.length - 1 ? `${b}-${buckets[i + 1]}` : `${b}+`);
        const bucketCounts = new Array(buckets.length).fill(0);
        leaderboard.forEach(r => {
            let idx = buckets.findIndex((b, i) => r.score >= b && (i === buckets.length - 1 || r.score < buckets[i + 1]));
            if (idx < 0) idx = buckets.length - 1;
            bucketCounts[idx]++;
        });

        // ----- Accounts created per day (last 30 days with data) -----
        const accountsByDay = {};
        profiles.forEach(p => {
            const k = dayKey(p.created_at);
            accountsByDay[k] = (accountsByDay[k] || 0) + 1;
        });
        const accountDayLabels = Object.keys(accountsByDay).sort().slice(-30);
        const accountDayCounts = accountDayLabels.map(d => accountsByDay[d]);

        // ----- Top scores table -----
        const topScores = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 15);

        // ----- Heartbeats: time-on-page (session_heartbeat, 1 beat = 0.5 min) -----
        const heartbeats = events.filter(e => e.event_type === 'session_heartbeat');
        const todayKey = dayKey(new Date());

        const heartbeatsByUserAllTime = {};
        const heartbeatsByUserToday = {};
        const heartbeatsByDay = {};
        heartbeats.forEach(e => {
            heartbeatsByUserAllTime[e.user_id] = (heartbeatsByUserAllTime[e.user_id] || 0) + 1;
            const d = dayKey(e.created_at);
            heartbeatsByDay[d] = (heartbeatsByDay[d] || 0) + 1;
            if (d === todayKey) {
                heartbeatsByUserToday[e.user_id] = (heartbeatsByUserToday[e.user_id] || 0) + 1;
            }
        });

        // Total hours on the trail: all heartbeats, and the subset logged by users
        // who have at least one completed run (status !== 'in_progress') — excludes
        // time from users who only ever loaded the page or abandoned mid-run.
        const completedUserIds = new Set(completedRuns.map(r => r.user_id));
        const totalHoursAll = (heartbeats.length * MINUTES_PER_HEARTBEAT) / 60;
        const totalHoursCompletedUsers = (heartbeats.filter(e => completedUserIds.has(e.user_id)).length * MINUTES_PER_HEARTBEAT) / 60;
        const avgHoursPerCompletedTrainer = completedUserIds.size ? totalHoursCompletedUsers / completedUserIds.size : 0;

        const topHeartbeatUsersAllTime = allSorted(heartbeatsByUserAllTime)
            .map(([userId, count]) => [nameFor(userId), +(count * MINUTES_PER_HEARTBEAT).toFixed(1)]);
        const topHeartbeatUsersToday = allSorted(heartbeatsByUserToday)
            .map(([userId, count]) => [nameFor(userId), +(count * MINUTES_PER_HEARTBEAT).toFixed(1)]);

        const heartbeatDayLabelsAll = Object.keys(heartbeatsByDay).sort();
        const heartbeatDayMinutesAll = heartbeatDayLabelsAll.map(d => +(heartbeatsByDay[d] * MINUTES_PER_HEARTBEAT).toFixed(1));
        const heartbeatDayLabels = heartbeatDayLabelsAll.slice(-30);
        const heartbeatDayMinutes = heartbeatDayMinutesAll.slice(-30);

        // ----- Death locations, in game-progression order (Pallet Town -> Mt. Silver) -----
        // Keyed by payload.route_index rather than the route name — several names repeat
        // (Viridian City, Victory Road, Indigo Plateau) between a first pass and a Johto
        // revisit, so name alone can't tell a Kanto death from a Johto one. route_index
        // matches state.currentLocationIndex 1:1 against ROUTE_ORDER above. (johto_run_ended
        // is a duplicate event for the same death, so it's excluded to avoid double-counting.)
        const deathCountsByIndex = new Array(ROUTE_ORDER.length).fill(0);
        let deathsWithUnknownLocation = 0;
        events.filter(e => e.event_type === 'game_over').forEach(e => {
            const idx = e.payload && e.payload.route_index;
            if (Number.isInteger(idx) && idx >= 0 && idx < ROUTE_ORDER.length) {
                deathCountsByIndex[idx]++;
            } else {
                deathsWithUnknownLocation++;
            }
        });
        const deathLocationLabels = ROUTE_ORDER.map(r => r.name);
        const deathLocationCounts = deathCountsByIndex.slice();
        if (deathsWithUnknownLocation > 0) {
            deathLocationLabels.push('Unknown Location');
            deathLocationCounts.push(deathsWithUnknownLocation);
        }

        app.innerHTML = `
            <section class="dex-section">
                <h2>&gt; Overview</h2>
                <div class="stat-grid">
                    ${statCard('Trainers Registered', profilesCount)}
                    ${statCard('Total Runs Logged', totalRuns)}
                    ${statCard('Full Victory Rate', pct(wins, completedRuns.length))}
                    ${statCard('Kanto E4 Clear Rate', pct(e4Clears, completedRuns.length))}
                    ${statCard('Avg Score', Math.round(avg(leaderboard.map(r => r.score))))}
                    ${statCard('Avg Days Survived', avg(leaderboard.map(r => r.days_elapsed)).toFixed(1))}
                    ${statCard('Avg Pokedex Count', avg(leaderboard.map(r => r.pokedex_count)).toFixed(1))}
                    ${statCard('Johto Runs Completed', johtoEntries)}
                    ${statCard('Total Hours On Trail', totalHoursAll.toFixed(1))}
                    ${statCard('Trainers With A Completed Run', `${completedUserIds.size} / ${profilesCount}`)}
                    ${statCard('Total Hours (Completed-Run Trainers)', totalHoursCompletedUsers.toFixed(1))}
                    ${statCard('Avg Hours Per Completed-Run Trainer', avgHoursPerCompletedTrainer.toFixed(1))}
                    ${statCard('Red Challenged', redChallenges)}
                    ${statCard('Red Defeated', `${redWins} (${pct(redWins, redChallenges)})`)}
                </div>
            </section>

            <section class="dex-section">
                <h2>&gt; Activity</h2>
                <div class="panel-grid">
                    <div class="panel">
                        <h3>Runs Logged Per Day</h3>
                        <canvas id="chart-runs-day"></canvas>
                    </div>
                    <div class="panel">
                        <h3>Accounts Created Per Day</h3>
                        <canvas id="chart-accounts-day"></canvas>
                    </div>
                </div>
            </section>

            <section class="dex-section">
                <h2>&gt; Time On Trail (Heartbeats, 1 beat = 30s)</h2>
                <div class="panel" id="group-heartbeat-day">
                    <div class="panel-header-row">
                        <h3>Minutes-On-Page Per Day, All Trainers</h3>
                        <div class="range-toggle">
                            <button class="range-btn active" data-range="30">30 DAYS</button>
                            <button class="range-btn" data-range="7">7 DAYS</button>
                        </div>
                    </div>
                    <canvas id="chart-heartbeat-day"></canvas>
                </div>
                <div class="panel wide" style="margin-top: 16px;">
                    <h3>Top Trainers By Time On Page (All-Time)</h3>
                    <div class="chart-tall" id="wrap-heartbeat-alltime" style="height: ${tallChartHeight(Math.min(SEE_MORE_STEP, topHeartbeatUsersAllTime.length))}px;">
                        <canvas id="chart-heartbeat-alltime"></canvas>
                    </div>
                    <button class="see-more-btn" id="btn-heartbeat-alltime">SEE MORE ▼</button>
                </div>
                <div class="panel wide" style="margin-top: 16px;">
                    <h3>Top Trainers By Time On Page (Today)</h3>
                    <div class="chart-tall" id="wrap-heartbeat-today" style="height: ${tallChartHeight(Math.min(SEE_MORE_STEP, topHeartbeatUsersToday.length))}px;">
                        <canvas id="chart-heartbeat-today"></canvas>
                    </div>
                    <button class="see-more-btn" id="btn-heartbeat-today">SEE MORE ▼</button>
                </div>
            </section>

            <section class="dex-section">
                <h2>&gt; Player Behavior</h2>
                <div class="panel-grid">
                    <div class="panel">
                        <h3>Starter Popularity</h3>
                        <canvas id="chart-starters"></canvas>
                    </div>
                    <div class="panel">
                        <h3>Game Over Reasons</h3>
                        <canvas id="chart-reasons"></canvas>
                    </div>
                    <div class="panel">
                        <h3>Score Distribution</h3>
                        <canvas id="chart-scores"></canvas>
                    </div>
                    <div class="panel wide">
                        <h3>Where Trainers Die Most Often</h3>
                        <div class="chart-tall" style="height: ${tallChartHeight(deathLocationLabels.length)}px;">
                            <canvas id="chart-deaths"></canvas>
                        </div>
                    </div>
                </div>
            </section>

            <section class="dex-section">
                <h2>&gt; Top Runs</h2>
                <div class="panel table-scroll">
                    <table class="dex-table">
                        <thead>
                            <tr><th>#</th><th>Trainer</th><th>Score</th><th>Days</th><th>Badges</th><th>Dex</th><th>Result</th><th>Date</th></tr>
                        </thead>
                        <tbody>
                            ${topScores.map((r, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${r.username}</td>
                                    <td>${r.score}</td>
                                    <td>${r.days_elapsed}</td>
                                    <td>${r.badges}</td>
                                    <td>${r.pokedex_count}</td>
                                    <td><span class="pill ${r.won ? 'win' : 'loss'}">${r.won ? 'WON' : (r.kanto_e4_cleared ? 'E4' : '—')}</span></td>
                                    <td>${r.date || ''}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </section>

            <footer>OPS·DEX — READ-ONLY — PRODUCTION SUPABASE — ${new Date().getFullYear()}</footer>
        `;

        buildLineChart('chart-runs-day', dayLabels, [{
            label: 'Runs',
            data: dayCounts,
            borderColor: '#33ff8c',
            backgroundColor: 'rgba(51,255,140,0.15)',
            fill: true,
            tension: 0.25
        }]);

        buildLineChart('chart-accounts-day', accountDayLabels, [{
            label: 'Accounts Created',
            data: accountDayCounts,
            borderColor: '#33ff8c',
            backgroundColor: 'rgba(51,255,140,0.15)',
            fill: true,
            tension: 0.25
        }]);

        buildBarChart('chart-starters', starterTop.map(x => x[0]), starterTop.map(x => x[1]), 'Runs');
        buildDoughnut('chart-reasons', Object.keys(reasonCounts), Object.values(reasonCounts));
        buildBarChart('chart-scores', bucketLabels, bucketCounts, 'Runs');

        const alltimePage = topHeartbeatUsersAllTime.slice(0, SEE_MORE_STEP);
        const todayPage = topHeartbeatUsersToday.slice(0, SEE_MORE_STEP);
        const chartHeartbeatAllTime = buildHBarChart('chart-heartbeat-alltime', alltimePage.map(x => x[0]), alltimePage.map(x => x[1]), 'Minutes', 60);
        const chartHeartbeatToday = buildHBarChart('chart-heartbeat-today', todayPage.map(x => x[0]), todayPage.map(x => x[1]), 'Minutes', 60);
        setupSeeMore('btn-heartbeat-alltime', 'wrap-heartbeat-alltime', chartHeartbeatAllTime, topHeartbeatUsersAllTime);
        setupSeeMore('btn-heartbeat-today', 'wrap-heartbeat-today', chartHeartbeatToday, topHeartbeatUsersToday);

        const chartHeartbeatDay = buildLineChart('chart-heartbeat-day', heartbeatDayLabels, [{
            label: 'Minutes on page (all trainers)',
            data: heartbeatDayMinutes,
            borderColor: '#ffb020',
            backgroundColor: 'rgba(255,176,32,0.15)',
            fill: true,
            tension: 0.25
        }]);
        setupRangeToggle('#group-heartbeat-day', chartHeartbeatDay, heartbeatDayLabelsAll, heartbeatDayMinutesAll);

        buildHBarChart('chart-deaths', deathLocationLabels, deathLocationCounts, 'Deaths');
    }

    async function main() {
        try {
            const [profiles, leaderboard, events] = await Promise.all([
                fetchAll('pt_profiles', 'id, username, created_at'),
                fetchAll('pt_leaderboard', 'user_id, username, score, pokedex_count, badges, days_elapsed, won, date, status, kanto_e4_cleared, johto_completed, legendary_count, created_at'),
                fetchAll('pt_events', 'event_type, payload, created_at, user_id')
            ]);
            render(profiles, leaderboard, events);
            refreshEl.textContent = `SYNCED ${new Date().toLocaleTimeString()}`;
        } catch (err) {
            app.innerHTML = `<div class="error-row">UPLINK FAILED: ${err.message}</div>`;
            refreshEl.textContent = 'SYNC ERROR';
        }
    }

    main();
})();
