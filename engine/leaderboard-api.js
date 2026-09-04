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

    // `region`: 'kanto' (default) or 'johto' (§13.2 leaderboard toggle) — the
    // Johto view ranks by johto_score and only includes runs that reached Johto.
    function getGlobalLeaderboard(region) {
        return fetchOrdered('score', false, false, null, null, region, 'johto_score');
    }

    // Columns available since launch, plus kanto_e4_cleared (added by this same
    // migration pass that added kanto_e4_cleared — see engine/scoring.js's
    // getKantoE4Cleared and the pt_e4_wins_leaderboard() comment below). Unlike
    // legendary_count, this one IS in BASE_COLUMNS rather than its own opt-in
    // query, so the ★ "win" marker (renderTable in screens/leaderboard-screen.js)
    // can show correctly on every row-based tab — but that means a database that
    // hasn't had `alter table pt_leaderboard add column if not exists
    // kanto_e4_cleared boolean not null default false;` applied yet will 400 on
    // EVERY row-based tab (HIGH SCORE, TOP TRAINERS, MOST CATCHES, FASTEST WIN),
    // not just one. Apply it before relying on any of those on a given
    // environment (staging vs prod are separate Supabase projects).
    const BASE_COLUMNS = 'user_id, username, score, pokedex_count, badges, days_elapsed, won, date, status, kanto_e4_cleared';

    // Same idea, extended with the Johto columns (§13.1-13.2, supabase/schema.sql).
    // Only used for a Johto-region fetch, so a staging/prod DB that hasn't had the
    // migration applied yet keeps every Kanto tab (which uses BASE_COLUMNS) working
    // — only the Johto toggle degrades (to "Could not load scores") until it has.
    const JOHTO_COLUMNS = BASE_COLUMNS + ', johto_completed, johto_badges, johto_days_elapsed, johto_score, johto_pokedex_count';

    function rowToEntry(row) {
        return {
            userId: row.user_id,
            name: row.username,
            score: row.score,
            pokedexCount: row.pokedex_count,
            badges: row.badges,
            daysElapsed: row.days_elapsed,
            won: row.won,
            // Row-based tabs' ★ marker (screens/leaderboard-screen.js) uses this
            // instead of `won` — Kanto E4 clear, not the full Red-capstone win.
            kantoE4Cleared: !!row.kanto_e4_cleared,
            date: row.date,
            inProgress: row.status === 'in_progress',
            legendaryCount: row.legendary_count || 0,
            // Johto view (§13.2) — undefined/null on a Kanto-only run, or on a
            // DB that hasn't had the Johto migration applied yet.
            johtoCompleted: !!row.johto_completed,
            johtoBadges: row.johto_badges,
            johtoDaysElapsed: row.johto_days_elapsed,
            johtoScore: row.johto_score,
            johtoPokedexCount: row.johto_pokedex_count
        };
    }

    // Shared fetch: rows ordered by a column, optionally restricted to completed
    // wins. `region` ('kanto' | 'johto') picks which pair of columns to sort/filter
    // by — the Johto view only shows runs that actually reached Johto (i.e. have a
    // non-null johtoColumn value), same idea as the existing wonOnly filter.
    // `region`: 'all' (default — every run, no filter), 'kanto' (only runs
    // that never continued into Johto), or 'johto' (only runs that did,
    // ranked by their johto_* column). 'all' and 'kanto' both rank by the
    // base column since a run's overall score/badges/etc. already reflect
    // the whole run regardless of how far it went.
    async function fetchOrdered(column, ascending, wonOnly, limit, columns, region, johtoColumn, levelFilter) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isConfigured()) return null;

        const client = auth.getClient();
        if (!client) return null;

        const isJohto = region === 'johto';
        const isKantoOnly = region === 'kanto';
        const sortColumn = isJohto ? (johtoColumn || column) : column;

        let query = client
            .from('pt_leaderboard')
            .select(columns || (isJohto ? JOHTO_COLUMNS : BASE_COLUMNS))
            .order(sortColumn, { ascending });

        if (isJohto) {
            query = query.not(sortColumn, 'is', null);
            if (wonOnly) query = query.eq('johto_completed', true);
        } else {
            if (isKantoOnly) query = query.is('johto_score', null);
            // wonOnly is only ever passed by getFastestWinLeaderboard, and per
            // the "Kanto E4 is the win marker" convention it means "cleared
            // Kanto's E4" — not the full Red-capstone win (`won`), which is
            // its own separate, much rarer achievement (see RED WINS tab).
            if (wonOnly) query = query.eq('kanto_e4_cleared', true);
        }

        if (levelFilter) query = query.eq('difficulty_level', levelFilter);

        const { data, error } = await query.limit(limit || 20);

        if (error) {
            console.warn('Could not fetch leaderboard:', error);
            return null;
        }

        return data.map(rowToEntry);
    }

    // Highest Pokedex count in a single run. `region`: 'kanto' (default) or 'johto'
    // — the Johto view ranks by johto_pokedex_count and only includes runs that
    // reached Johto.
    // `levelFilter` (optional, 1-5): restrict to runs started at that
    // difficulty level. Omit for no change from prior behavior.
    function getMostCatchesLeaderboard(region, levelFilter) {
        return fetchOrdered('pokedex_count', false, false, null, null, region, 'johto_pokedex_count', levelFilter);
    }

    // Lifetime Pokedex completion — unique Pokemon ever caught across ALL of a
    // trainer's runs, not just their best single run. Requires a
    // `pokedex_ids integer[] default '{}'` column on pt_leaderboard plus a
    // Postgres function to union it per user — run this once in the Supabase
    // SQL editor:
    //   alter table pt_leaderboard add column if not exists pokedex_ids integer[] default '{}';
    //   create or replace function pt_dex_completion_leaderboard()
    //   returns table(user_id uuid, username text, dex_count bigint, badges int, days_elapsed int, won boolean, date text)
    //   language sql stable as $$
    //     select
    //       l.user_id,
    //       max(l.username) as username,
    //       count(distinct pid) as dex_count,
    //       max(l.badges) as badges,
    //       min(l.days_elapsed) as days_elapsed,
    //       bool_or(l.won) as won,
    //       max(l.date) as date
    //     from pt_leaderboard l
    //     left join lateral unnest(l.pokedex_ids) as pid on true
    //     group by l.user_id
    //     order by dex_count desc nulls last
    //     limit 20;
    //   $$;
    // `levelFilter` param accepted for signature parity with the other named
    // leaderboard functions, but deliberately not wired to a `.eq(...)` here
    // — this reads from a Postgres RPC (pt_dex_completion_leaderboard) that
    // aggregates lifetime dex completion per user_id across ALL of their
    // runs/levels; it doesn't select or group by difficulty_level, so there's
    // no column to filter on without rewriting the SQL function itself.
    async function getDexCompletionLeaderboard(levelFilter) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isConfigured()) return null;

        const client = auth.getClient();
        if (!client) return null;

        const { data, error } = await client.rpc('pt_dex_completion_leaderboard');

        if (error) {
            console.warn('Could not fetch dex completion leaderboard (has the SQL migration run?):', error);
            return null;
        }

        return data.map(row => ({
            userId: row.user_id,
            name: row.username,
            pokedexCount: row.dex_count,
            badges: row.badges,
            daysElapsed: row.days_elapsed,
            won: row.won,
            date: row.date,
            inProgress: false
        }));
    }

    // Fastest win — lowest days_elapsed among completed wins. `region`: 'kanto'
    // (default) or 'johto' — the Johto view ranks by johto_days_elapsed (days spent
    // in Johto, not total run length) among runs where johto_completed is true.
    // `levelFilter` (optional, 1-5): restrict to runs started at that
    // difficulty level. Omit for no change from prior behavior.
    function getFastestWinLeaderboard(region, levelFilter) {
        return fetchOrdered('days_elapsed', true, true, null, null, region, 'johto_days_elapsed', levelFilter);
    }

    // Lifetime legendaries caught — unique legendary Pokemon ever caught across
    // ALL of a trainer's runs, not just their best single run. Trainers with
    // zero are excluded entirely (HAVING > 0), not shown as a 0 row. Requires a
    // `legendary_ids integer[] default '{}'` column on pt_leaderboard plus a
    // Postgres function to union it per user — run this once in the Supabase
    // SQL editor:
    //   alter table pt_leaderboard add column if not exists legendary_ids integer[] default '{}';
    //   create or replace function pt_legendary_completion_leaderboard()
    //   returns table(user_id uuid, username text, legendary_count bigint, days_elapsed int, won boolean, date text)
    //   language sql stable as $$
    //     select
    //       l.user_id,
    //       max(l.username) as username,
    //       count(distinct pid) as legendary_count,
    //       min(l.days_elapsed) as days_elapsed,
    //       bool_or(l.won) as won,
    //       max(l.date) as date
    //     from pt_leaderboard l
    //     left join lateral unnest(l.legendary_ids) as pid on true
    //     group by l.user_id
    //     having count(distinct pid) > 0
    //     order by legendary_count desc
    //     limit 20;
    //   $$;
    // `levelFilter` param accepted for signature parity — see the identical
    // note on getDexCompletionLeaderboard above; this is also a lifetime,
    // cross-level RPC aggregate with no difficulty_level to filter on.
    async function getLegendaryLeaderboard(levelFilter) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isConfigured()) return null;

        const client = auth.getClient();
        if (!client) return null;

        const { data, error } = await client.rpc('pt_legendary_completion_leaderboard');

        if (error) {
            console.warn('Could not fetch legendary completion leaderboard (has the SQL migration run?):', error);
            return null;
        }

        return data.map(row => ({
            userId: row.user_id,
            name: row.username,
            legendaryCount: row.legendary_count,
            daysElapsed: row.days_elapsed,
            won: row.won,
            date: row.date,
            inProgress: false
        }));
    }

    // Lifetime champions — unique Pokemon that have survived a Kanto E4 clear
    // (i.e. carry the "champion" tag — screens/elite-four-screen.js stamps
    // state.kantoChampionIds at that moment, and victory-screen.js/
    // gameover-screen.js both now save championIds, not just a full Red win),
    // across ALL of a trainer's runs. Trainers with zero are excluded
    // entirely (HAVING > 0). Requires a `champion_ids integer[] default '{}'`
    // column on pt_leaderboard plus a Postgres function to union it per user —
    // run this once in the Supabase SQL editor:
    //   alter table pt_leaderboard add column if not exists champion_ids integer[] default '{}';
    //   create or replace function pt_champion_leaderboard()
    //   returns table(user_id uuid, username text, champion_count bigint, days_elapsed int, kanto_e4_cleared boolean, date text)
    //   language sql stable as $$
    //     select
    //       l.user_id,
    //       max(l.username) as username,
    //       count(distinct pid) as champion_count,
    //       min(l.days_elapsed) as days_elapsed,
    //       bool_or(l.kanto_e4_cleared) as kanto_e4_cleared,
    //       max(l.date) as date
    //     from pt_leaderboard l
    //     left join lateral unnest(l.champion_ids) as pid on true
    //     group by l.user_id
    //     having count(distinct pid) > 0
    //     order by champion_count desc
    //     limit 20;
    //   $$;
    // `levelFilter` param accepted for signature parity — see the identical
    // note on getDexCompletionLeaderboard above (and per this project's
    // "Kanto E4 is level-agnostic by design" convention, Champion Pokemon
    // stays a lifetime, cross-level stat regardless).
    async function getChampionLeaderboard(levelFilter) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isConfigured()) return null;

        const client = auth.getClient();
        if (!client) return null;

        const { data, error } = await client.rpc('pt_champion_leaderboard');

        if (error) {
            console.warn('Could not fetch champion leaderboard (has the SQL migration run?):', error);
            return null;
        }

        return data.map(row => ({
            userId: row.user_id,
            name: row.username,
            championCount: row.champion_count,
            daysElapsed: row.days_elapsed,
            kantoE4Cleared: !!row.kanto_e4_cleared,
            date: row.date,
            inProgress: false
        }));
    }

    // Lifetime Elite Four wins — total number of times a trainer has beaten
    // an Elite Four (Kanto's `kanto_e4_cleared` flag and/or Johto's
    // `johto_completed` flag), summed across ALL of their runs, not just
    // their best one. Deliberately NOT keyed on `won` (full Red-capstone
    // victory) — beating Red is a separate, much bigger accomplishment than
    // either regional E4 clear, and since screens/postvictory-screen.js
    // auto-continues every Kanto E4 winner straight into Johto with no way
    // to stop there, `won` would wildly undercount real Kanto E4 clears if
    // used as its proxy. Needs the kanto_e4_cleared column added (schema
    // migration below — run once in the Supabase SQL editor, on both the
    // staging and prod projects):
    //   alter table pt_leaderboard add column if not exists kanto_e4_cleared boolean not null default false;
    //
    //   -- Backfill existing rows: any run that beat Red, or ever reached
    //   -- Johto at all (johto_score is not null on any Johto-region save),
    //   -- necessarily beat Kanto's E4 first — that's a hard prerequisite,
    //   -- so both conditions are safe, exact backfills.
    //   update pt_leaderboard set kanto_e4_cleared = true
    //   where won = true or johto_score is not null;
    //
    //   create or replace function pt_e4_wins_leaderboard()
    //   returns table(user_id uuid, username text, kanto_e4_wins bigint, johto_e4_wins bigint, days_elapsed int, date text)
    //   language sql stable as $$
    //     select
    //       l.user_id,
    //       max(l.username) as username,
    //       count(*) filter (where l.kanto_e4_cleared) as kanto_e4_wins,
    //       count(*) filter (where l.johto_completed) as johto_e4_wins,
    //       min(l.days_elapsed) as days_elapsed,
    //       max(l.date) as date
    //     from pt_leaderboard l
    //     where l.kanto_e4_cleared or l.johto_completed
    //     group by l.user_id
    //     order by (count(*) filter (where l.kanto_e4_cleared) + count(*) filter (where l.johto_completed)) desc
    //     limit 20;
    //   $$;
    // `levelFilter` param accepted for signature parity — see the identical
    // note on getDexCompletionLeaderboard above; E4 wins also stay
    // level-agnostic in spirit (a UI simply choosing not to pass this is how
    // that's expressed).
    async function getE4WinsLeaderboard(levelFilter) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isConfigured()) return null;

        const client = auth.getClient();
        if (!client) return null;

        const { data, error } = await client.rpc('pt_e4_wins_leaderboard');

        if (error) {
            console.warn('Could not fetch E4 wins leaderboard (has the SQL migration run?):', error);
            return null;
        }

        return data.map(row => ({
            userId: row.user_id,
            name: row.username,
            kantoE4Wins: row.kanto_e4_wins,
            johtoE4Wins: row.johto_e4_wins,
            daysElapsed: row.days_elapsed,
            date: row.date,
            inProgress: false
        }));
    }

    // Lifetime Red (Mt. Silver capstone) wins — the actual full-game completion,
    // kept as its own separate leaderboard from E4 WINS since beating Red is a
    // much bigger, later accomplishment than either regional Elite Four clear
    // (see getKantoE4Cleared in engine/scoring.js). No new column needed — `won`
    // (state.hasWon) has existed since launch.
    //
    // `won` alone is NOT enough to mean "beat Red", though: before the Johto
    // expansion, beating Kanto's E4 WAS the entire game and set won=true (see
    // the state.hasWon=true fallback still sitting in the region==='kanto'
    // branch of screens/elite-four-screen.js, now unreachable in normal play
    // but never cleaned out of old rows). Every one of those pre-expansion
    // rows still has won=true sitting in pt_leaderboard with no Red capstone
    // ever touched. A genuine Red win is only reachable after passing through
    // Johto (screens/red-capstone-screen.js only runs with state.region ===
    // 'johto'), which always populates johto_score — every legacy pre-Johto
    // win has johto_score still null — so `and l.johto_score is not null`
    // is what actually distinguishes a real Red win from old Kanto-only data.
    // Tiebreaker (§ speed): trainers tied on red_wins are ranked by their
    // fastest (minimum) days-to-beat-Red across their winning runs, ascending
    // — the same "Day X fastest" figure already shown alongside the win
    // count, now also used to break ties instead of just being displayed.
    // Run once in the Supabase SQL editor (or DROP FUNCTION first if
    // pt_red_wins_leaderboard() already exists with a different signature):
    //   create or replace function pt_red_wins_leaderboard()
    //   returns table(user_id uuid, username text, red_wins bigint, days_elapsed int, date text)
    //   language sql stable as $$
    //     select
    //       l.user_id,
    //       max(l.username) as username,
    //       count(*) filter (where l.won and l.johto_score is not null) as red_wins,
    //       min(l.days_elapsed) filter (where l.won and l.johto_score is not null) as days_elapsed,
    //       max(l.date) as date
    //     from pt_leaderboard l
    //     where l.won and l.johto_score is not null
    //     group by l.user_id
    //     order by count(*) filter (where l.won and l.johto_score is not null) desc,
    //              min(l.days_elapsed) filter (where l.won and l.johto_score is not null) asc
    //     limit 20;
    //   $$;
    // `levelFilter` param accepted for signature parity — see the identical
    // note on getDexCompletionLeaderboard above. (The RECORDS screen's new
    // per-level L2-L5 WINS rows are sourced from engine/records.js's local+
    // cloud tally instead of this RPC, for exactly this reason.)
    async function getRedWinsLeaderboard(levelFilter) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isConfigured()) return null;

        const client = auth.getClient();
        if (!client) return null;

        const { data, error } = await client.rpc('pt_red_wins_leaderboard');

        if (error) {
            console.warn('Could not fetch Red wins leaderboard (has the SQL migration run?):', error);
            return null;
        }

        return data.map(row => ({
            userId: row.user_id,
            name: row.username,
            redWins: row.red_wins,
            daysElapsed: row.days_elapsed,
            date: row.date,
            inProgress: false
        }));
    }

    // Top 10 unique trainers ranked by their personal best run. `region`: 'kanto'
    // (default) or 'johto' — the Johto view ranks by johto_score and only
    // considers runs that reached Johto.
    // `levelFilter` (optional, 1-5): restrict to runs started at that
    // difficulty level. Omit for no change from prior behavior.
    async function getTopTrainers(region, levelFilter) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isConfigured()) return null;

        const client = auth.getClient();
        if (!client) return null;

        const isJohto = region === 'johto';
        const isKantoOnly = region === 'kanto';
        const sortColumn = isJohto ? 'johto_score' : 'score';

        // Fetch enough rows to guarantee we find 10 unique users
        let query = client
            .from('pt_leaderboard')
            .select(isJohto ? JOHTO_COLUMNS : BASE_COLUMNS)
            .order(sortColumn, { ascending: false });
        if (isJohto) query = query.not(sortColumn, 'is', null);
        else if (isKantoOnly) query = query.is('johto_score', null);
        if (levelFilter) query = query.eq('difficulty_level', levelFilter);

        const { data, error } = await query.limit(500);

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

    // Site-wide "Trainers fallen on the trail" / "Hall of Fame members" counts
    // for the title-screen tagline — every completed run across every account,
    // not just this device's local PT.Engine.Records tally. Same run-counting
    // semantics Records used locally (each completed run counts once; a player
    // who's won more than once adds more than one to the win count) — just
    // summed over pt_leaderboard's public-read rows instead of localStorage.
    // Returns null if Supabase isn't configured or either query fails, so the
    // caller can fall back to something sensible instead of showing 0/0.
    async function getGlobalPlayerStats() {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isConfigured()) return null;
        const client = auth.getClient();
        if (!client) return null;

        const [totalRes, wonRes] = await Promise.all([
            client.from('pt_leaderboard').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
            client.from('pt_leaderboard').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('won', true)
        ]);
        if (totalRes.error || wonRes.error) {
            console.warn('Could not fetch global player stats:', totalRes.error || wonRes.error);
            return null;
        }
        const totalRuns = totalRes.count || 0;
        const totalWins = wonRes.count || 0;
        return { fallenCount: Math.max(0, totalRuns - totalWins), hallOfFameCount: totalWins };
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
            legendary_count: entry.legendaryCount || 0,
            pokedex_ids: entry.pokedexIds || [],
            legendary_ids: entry.legendaryIds || [],
            champion_ids: entry.championIds || [],
            // Johto columns (§13.1-13.2) — null/false on a Kanto-only run, only
            // populated once state.region has become 'johto' (see engine/scoring.js
            // and screens/victory-screen.js / screens/gameover-screen.js).
            johto_completed: !!entry.johtoCompleted,
            johto_badges: entry.johtoBadges != null ? entry.johtoBadges : null,
            johto_days_elapsed: entry.johtoDaysElapsed != null ? entry.johtoDaysElapsed : null,
            johto_score: entry.johtoScore != null ? entry.johtoScore : null,
            johto_pokedex_count: entry.johtoPokedexCount != null ? entry.johtoPokedexCount : null,
            // Kanto E4 clear (engine/scoring.js's getKantoE4Cleared) — a
            // separate accomplishment from `won` (full Red-capstone victory)
            // and from johto_completed (Johto E4 clear). See the
            // pt_e4_wins_leaderboard() RPC below: it must filter on this
            // column for the Kanto count, not on `won`, since every Kanto E4
            // winner is auto-continued into Johto with no way to stop there.
            kanto_e4_cleared: !!entry.kantoE4Cleared,
            // Difficulty level (1-5, see data/difficulty-levels.js) this run
            // was started on — feeds getHighestUnlockedLevel below. Defaults
            // to 1 to match the column's own DB default for pre-existing
            // rows/callers that don't pass it through yet.
            difficulty_level: entry.difficultyLevel || 1
        };

        let { error } = await client.from('pt_leaderboard').upsert(row, { onConflict: 'run_id' });

        // legendary_count / pokedex_ids / legendary_ids / champion_ids / johto_*
        // don't exist until the pt_leaderboard migration runs — fall back to
        // saving without them so scores keep saving in the meantime.
        if (error && error.code === 'PGRST204') {
            delete row.legendary_count;
            delete row.pokedex_ids;
            delete row.legendary_ids;
            delete row.champion_ids;
            delete row.johto_completed;
            delete row.johto_badges;
            delete row.johto_days_elapsed;
            delete row.johto_score;
            delete row.johto_pokedex_count;
            delete row.difficulty_level;
            ({ error } = await client.from('pt_leaderboard').upsert(row, { onConflict: 'run_id' }));
        }

        // A completed run (won or not) only gets ONE shot at this — there's no
        // "retry on next launch" mechanism, the run is already over and the
        // player's about to see the local score regardless. A transient failure
        // (token silently expired, brief network blip — see the onAuthStateChange
        // comment in engine/auth.js) used to mean total, invisible data loss.
        // Two short-backoff retries before giving up costs nothing on the
        // happy path and catches exactly that class of failure.
        for (let attempt = 0; error && attempt < 2; attempt++) {
            await new Promise(resolve => setTimeout(resolve, 400 * (attempt + 1)));
            ({ error } = await client.from('pt_leaderboard').upsert(row, { onConflict: 'run_id' }));
        }

        if (error) {
            console.warn('Could not save global score:', error);
        }
    }

    // ===== LEVEL UNLOCKS =====
    // Highest level an account may start on = min(5, 1 + MAX(difficulty_level)
    // across pt_leaderboard rows for that user where won = true), defaulting
    // to 1 for an account with no wins. Deliberately derived from existing win
    // history rather than tracked in its own table/migration — a default-1
    // difficulty_level column already correctly grandfathers every
    // pre-existing Red-win account into Level 2 eligibility with no backfill.
    const LEVEL_UNLOCK_KEY = 'porygonTrail_highestUnlockedLevel';

    // Logged-out / dev-mode fallback — same "cloud disabled, local still
    // works" pattern as the rest of this file (see isGlobalEnabled / saveLocal).
    function getLocalHighestUnlockedLevel() {
        try {
            const stored = parseInt(localStorage.getItem(LEVEL_UNLOCK_KEY), 10);
            return stored > 0 ? Math.min(5, stored) : 1;
        } catch (e) {
            return 1;
        }
    }

    async function getHighestUnlockedLevel(state) {
        const auth = PT.Engine.Auth;
        if (auth && auth.isConfigured() && auth.isLoggedIn()) {
            const client = auth.getClient();
            const user = auth.getCurrentUser();
            if (client && user) {
                const { data, error } = await client
                    .from('pt_leaderboard')
                    .select('difficulty_level')
                    .eq('user_id', user.id)
                    .eq('won', true)
                    .order('difficulty_level', { ascending: false })
                    .limit(1);
                if (!error && data && data.length > 0) {
                    const maxWon = data[0].difficulty_level || 1;
                    return Math.min(5, maxWon + 1);
                }
                if (!error) return 1; // logged in, no wins yet — level 1 only
            }
        }
        // Logged out / dev mode / query failed — fall back to localStorage.
        return getLocalHighestUnlockedLevel();
    }

    // Called from the Red-capstone win screen. A Red win already gets saved
    // to pt_leaderboard via the normal won=true save path (with
    // difficulty_level included, see upsertGlobal above), so this just also
    // updates the local fallback used by getHighestUnlockedLevel, so an
    // offline/dev-mode player's next level unlocks immediately without a
    // round-trip read.
    function recordLevelWin(state, level) {
        try {
            const current = getLocalHighestUnlockedLevel();
            const next = Math.min(5, (level || 1) + 1);
            if (next > current) {
                localStorage.setItem(LEVEL_UNLOCK_KEY, String(next));
            }
        } catch (e) {
            console.warn('Could not save level unlock progress:', e);
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
        getDexCompletionLeaderboard,
        getFastestWinLeaderboard,
        getLegendaryLeaderboard,
        getChampionLeaderboard,
        getE4WinsLeaderboard,
        getRedWinsLeaderboard,
        saveToLeaderboard,
        saveInProgress,
        saveLocal,
        saveGlobal: upsertGlobal,
        clearLocal,
        isGlobalEnabled,
        getGlobalPlayerStats,
        getHighestUnlockedLevel,
        recordLevelWin
    };
})();
