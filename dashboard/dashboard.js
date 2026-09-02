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

    async function fetchCount(table) {
        const { count, error } = await client.from(table).select('*', { count: 'exact', head: true });
        if (error) throw new Error(`${table}: ${error.message}`);
        return count;
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

    function render(profilesCount, leaderboard, events) {
        const totalRuns = leaderboard.length;
        const completedRuns = leaderboard.filter(r => r.status !== 'in_progress');
        const wins = leaderboard.filter(r => r.won).length;
        const e4Clears = leaderboard.filter(r => r.kanto_e4_cleared).length;
        const johtoEntries = leaderboard.filter(r => r.johto_completed === true).length;

        // ----- Runs per day (last 30 days with data) -----
        const runsByDay = {};
        leaderboard.forEach(r => {
            const k = r.date || dayKey(r.created_at);
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
    }

    async function main() {
        try {
            const [profilesCount, leaderboard, events] = await Promise.all([
                fetchCount('pt_profiles'),
                fetchAll('pt_leaderboard', 'username, score, pokedex_count, badges, days_elapsed, won, date, status, kanto_e4_cleared, johto_completed, legendary_count, created_at'),
                fetchAll('pt_events', 'event_type, payload, created_at')
            ]);
            render(profilesCount, leaderboard, events);
            refreshEl.textContent = `SYNCED ${new Date().toLocaleTimeString()}`;
        } catch (err) {
            app.innerHTML = `<div class="error-row">UPLINK FAILED: ${err.message}</div>`;
            refreshEl.textContent = 'SYNC ERROR';
        }
    }

    main();
})();
