// Porygon Trail - Leaderboard API
// Local (localStorage) + Global (Supabase) leaderboards
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    const LOCAL_KEY = 'porygonTrail_leaderboard';
    const MAX_LOCAL = 10;

    // ===== LOCAL (Personal) =====
    function getLocalLeaderboard() {
        try {
            const data = localStorage.getItem(LOCAL_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveLocal(entry) {
        const board = getLocalLeaderboard();
        board.push(entry);
        board.sort((a, b) => b.score - a.score);
        const top = board.slice(0, MAX_LOCAL);
        try {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(top));
        } catch (e) {
            console.warn('Could not save local leaderboard:', e);
        }
        return top;
    }

    function clearLocal() {
        localStorage.removeItem(LOCAL_KEY);
    }

    // ===== GLOBAL (Supabase) =====
    function isGlobalEnabled() {
        return !!(PT.Engine.Auth && PT.Engine.Auth.isConfigured());
    }

    async function getGlobalLeaderboard() {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isConfigured()) return null;

        const client = auth.getClient();
        if (!client) return null;

        const { data, error } = await client
            .from('pt_leaderboard')
            .select(BASE_COLUMNS)
            .order('score', { ascending: false })
            .limit(20);

        if (error) {
            console.warn('Could not fetch global leaderboard:', error);
            return null;
        }

        return data.map(rowToEntry);
    }

    // Columns available since launch. legendary_count requires a schema migration
    // (see engine/leaderboard-api.js comment on getLegendaryLeaderboard), so it's
    // only requested by the query that actually needs it — otherwise a missing
    // column would 400 every leaderboard tab, not just the Legendaries one.
    const BASE_COLUMNS = 'user_id, username, score, pokedex_count, badges, days_elapsed, won, date, status';

    function rowToEntry(row) {
        return {
            userId: row.user_id,
            name: row.username,
            score: row.score,
            pokedexCount: row.pokedex_count,
            badges: row.badges,
            daysElapsed: row.days_elapsed,
            won: row.won,
            date: row.date,
            inProgress: row.status === 'in_progress',
            legendaryCount: row.legendary_count || 0
        };
    }

    // Shared fetch: rows ordered by a column, optionally restricted to completed wins.
    async function fetchOrdered(column, ascending, wonOnly, limit, columns) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isConfigured()) return null;

        const client = auth.getClient();
        if (!client) return null;

        let query = client
            .from('pt_leaderboard')
            .select(columns || BASE_COLUMNS)
            .order(column, { ascending });

        if (wonOnly) query = query.eq('won', true);

        const { data, error } = await query.limit(limit || 20);

        if (error) {
            console.warn('Could not fetch leaderboard:', error);
            return null;
        }

        return data.map(rowToEntry);
    }

    // Highest Pokedex count (also used for the Pokedex-completion leaderboard)
    function getMostCatchesLeaderboard() {
        return fetchOrdered('pokedex_count', false);
    }

    // Fastest win — lowest days_elapsed among completed wins
    function getFastestWinLeaderboard() {
        return fetchOrdered('days_elapsed', true, true);
    }

    // Most legendaries caught in a single run.
    // Requires a `legendary_count integer default 0` column on pt_leaderboard —
    // run this once in the Supabase SQL editor:
    //   ALTER TABLE pt_leaderboard ADD COLUMN legendary_count integer DEFAULT 0;
    function getLegendaryLeaderboard() {
        return fetchOrdered('legendary_count', false, false, 20, BASE_COLUMNS + ', legendary_count');
    }

    // Top 10 unique trainers ranked by their personal best run
    async function getTopTrainers() {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isConfigured()) return null;

        const client = auth.getClient();
        if (!client) return null;

        // Fetch enough rows to guarantee we find 10 unique users
        const { data, error } = await client
            .from('pt_leaderboard')
            .select(BASE_COLUMNS)
            .order('score', { ascending: false })
            .limit(500);

        if (error) {
            console.warn('Could not fetch top trainers:', error);
            return null;
        }

        // Keep only the highest-scoring run per user_id
        const seen = new Set();
        const trainers = [];
        for (const row of data) {
            if (!seen.has(row.user_id)) {
                seen.add(row.user_id);
                trainers.push(rowToEntry(row));
            }
            if (trainers.length >= 10) break;
        }
        return trainers;
    }

    // Insert or update this run's row (keyed by run_id), so an in-progress run
    // can keep updating the same leaderboard entry instead of spawning new rows.
    async function upsertGlobal(entry) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isLoggedIn()) return;
        if (!entry.runId) return;

        const client = auth.getClient();
        if (!client) return;

        const user = auth.getCurrentUser();
        const username = auth.getCurrentUsername();

        const row = {
            run_id: entry.runId,
            user_id: user.id,
            username: username,
            score: entry.score,
            pokedex_count: entry.pokedexCount || 0,
            badges: entry.badges || 0,
            days_elapsed: entry.daysElapsed || 0,
            won: entry.won || false,
            date: entry.date || new Date().toLocaleDateString(),
            status: entry.status || 'completed',
            legendary_count: entry.legendaryCount || 0
        };

        let { error } = await client.from('pt_leaderboard').upsert(row, { onConflict: 'run_id' });

        // legendary_count doesn't exist until the pt_leaderboard migration runs —
        // fall back to saving without it so scores keep saving in the meantime.
        if (error && error.code === 'PGRST204') {
            delete row.legendary_count;
            ({ error } = await client.from('pt_leaderboard').upsert(row, { onConflict: 'run_id' }));
        }

        if (error) {
            console.warn('Could not save global score:', error);
        }
    }

    // ===== UNIFIED SAVE (called from gameover/victory via Scoring module) =====
    function saveToLeaderboard(entry) {
        saveLocal(entry);
        // Tag with logged-in username before saving locally too
        const auth = PT.Engine.Auth;
        if (auth && auth.isLoggedIn()) {
            entry.name = auth.getCurrentUsername();
        }
        entry.status = 'completed';
        upsertGlobal(entry); // async, fire-and-forget
    }

    // Called after each day of an ongoing run so abandoned runs still show up
    // on the global leaderboard. No-op unless the player is signed in.
    function saveInProgress(entry) {
        entry.status = 'in_progress';
        upsertGlobal(entry); // async, fire-and-forget
    }

    PT.Engine.LeaderboardAPI = {
        getLocalLeaderboard,
        getGlobalLeaderboard,
        getTopTrainers,
        getMostCatchesLeaderboard,
        getFastestWinLeaderboard,
        getLegendaryLeaderboard,
        saveToLeaderboard,
        saveInProgress,
        saveLocal,
        saveGlobal: upsertGlobal,
        clearLocal,
        isGlobalEnabled
    };
})();
