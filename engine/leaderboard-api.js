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
            .select('user_id, username, score, pokedex_count, badges, days_elapsed, won, date')
            .order('score', { ascending: false })
            .limit(20);

        if (error) {
            console.warn('Could not fetch global leaderboard:', error);
            return null;
        }

        return data.map(row => ({
            userId: row.user_id,
            name: row.username,
            score: row.score,
            pokedexCount: row.pokedex_count,
            badges: row.badges,
            daysElapsed: row.days_elapsed,
            won: row.won,
            date: row.date
        }));
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
            .select('user_id, username, score, pokedex_count, badges, days_elapsed, won, date')
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
                trainers.push({
                    userId: row.user_id,
                    name: row.username,
                    score: row.score,
                    pokedexCount: row.pokedex_count,
                    badges: row.badges,
                    daysElapsed: row.days_elapsed,
                    won: row.won,
                    date: row.date
                });
            }
            if (trainers.length >= 10) break;
        }
        return trainers;
    }

    async function saveGlobal(entry) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isLoggedIn()) return;

        const client = auth.getClient();
        if (!client) return;

        const user = auth.getCurrentUser();
        const username = auth.getCurrentUsername();

        const { error } = await client.from('pt_leaderboard').insert({
            user_id: user.id,
            username: username,
            score: entry.score,
            pokedex_count: entry.pokedexCount || 0,
            badges: entry.badges || 0,
            days_elapsed: entry.daysElapsed || 0,
            won: entry.won || false,
            date: entry.date || new Date().toLocaleDateString()
        });

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
        saveGlobal(entry); // async, fire-and-forget
    }

    PT.Engine.LeaderboardAPI = {
        getLocalLeaderboard,
        getGlobalLeaderboard,
        getTopTrainers,
        saveToLeaderboard,
        saveLocal,
        saveGlobal,
        clearLocal,
        isGlobalEnabled
    };
})();
