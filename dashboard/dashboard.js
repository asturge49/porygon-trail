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
        new Chart(document.getElementById(canvasId), {
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

    function buildHBarChart(canvasId, labels, data, label) {
        new Chart(document.getElementById(canvasId), {
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
                    x: { ticks: { color: '#6ba585' }, grid: { color: '#1d4a2c' }, beginAtZero: true },
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

        // ----- Event type breakdown -----
        const eventTypeCounts = {};
        events.forEach(e => { eventTypeCounts[e.event_type] = (eventTypeCounts[e.event_type] || 0) + 1; });

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

        const topHeartbeatUsersAllTime = allSorted(heartbeatsByUserAllTime)
            .map(([userId, count]) => [nameFor(userId), +(count * MINUTES_PER_HEARTBEAT).toFixed(1)]);
        const topHeartbeatUsersToday = allSorted(heartbeatsByUserToday)
            .map(([userId, count]) => [nameFor(userId), +(count * MINUTES_PER_HEARTBEAT).toFixed(1)]);

        const heartbeatDayLabels = Object.keys(heartbeatsByDay).sort().slice(-30);
        const heartbeatDayMinutes = heartbeatDayLabels.map(d => +(heartbeatsByDay[d] * MINUTES_PER_HEARTBEAT).toFixed(1));

        // ----- Death locations (game_over.route — johto_run_ended is a duplicate
        // event for the same death, so it's excluded to avoid double-counting) -----
        const deathLocationCounts = {};
        events.filter(e => e.event_type === 'game_over').forEach(e => {
            const route = (e.payload && e.payload.route) || 'Unknown';
            deathLocationCounts[route] = (deathLocationCounts[route] || 0) + 1;
        });
        const deathLocationsSorted = topN(deathLocationCounts, 25);

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
                        <h3>Event Volume By Type</h3>
                        <canvas id="chart-event-types"></canvas>
                    </div>
                </div>
            </section>

            <section class="dex-section">
                <h2>&gt; Time On Trail (Heartbeats, 1 beat = 30s)</h2>
                <div class="panel">
                    <h3>Minutes-On-Page Per Day, All Trainers</h3>
                    <canvas id="chart-heartbeat-day"></canvas>
                </div>
                <div class="panel wide" style="margin-top: 16px;">
                    <h3>Every Trainer By Time On Page (All-Time)</h3>
                    <div class="chart-tall" style="height: ${tallChartHeight(topHeartbeatUsersAllTime.length)}px;">
                        <canvas id="chart-heartbeat-alltime"></canvas>
                    </div>
                </div>
                <div class="panel wide" style="margin-top: 16px;">
                    <h3>Every Trainer By Time On Page (Today)</h3>
                    <div class="chart-tall" style="height: ${tallChartHeight(topHeartbeatUsersToday.length)}px;">
                        <canvas id="chart-heartbeat-today"></canvas>
                    </div>
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
                        <div class="chart-tall" style="height: ${tallChartHeight(deathLocationsSorted.length)}px;">
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

        buildBarChart('chart-event-types', Object.keys(eventTypeCounts), Object.values(eventTypeCounts), 'Events');
        buildBarChart('chart-starters', starterTop.map(x => x[0]), starterTop.map(x => x[1]), 'Runs');
        buildDoughnut('chart-reasons', Object.keys(reasonCounts), Object.values(reasonCounts));
        buildBarChart('chart-scores', bucketLabels, bucketCounts, 'Runs');

        buildHBarChart('chart-heartbeat-alltime', topHeartbeatUsersAllTime.map(x => x[0]), topHeartbeatUsersAllTime.map(x => x[1]), 'Minutes');
        buildHBarChart('chart-heartbeat-today', topHeartbeatUsersToday.map(x => x[0]), topHeartbeatUsersToday.map(x => x[1]), 'Minutes');
        buildLineChart('chart-heartbeat-day', heartbeatDayLabels, [{
            label: 'Minutes on page (all trainers)',
            data: heartbeatDayMinutes,
            borderColor: '#ffb020',
            backgroundColor: 'rgba(255,176,32,0.15)',
            fill: true,
            tension: 0.25
        }]);
        buildHBarChart('chart-deaths', deathLocationsSorted.map(x => x[0]), deathLocationsSorted.map(x => x[1]), 'Deaths');
    }

    async function main() {
        try {
            const [profiles, leaderboard, events] = await Promise.all([
                fetchAll('pt_profiles', 'id, username'),
                fetchAll('pt_leaderboard', 'username, score, pokedex_count, badges, days_elapsed, won, date, status, kanto_e4_cleared, johto_completed, legendary_count, created_at'),
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
