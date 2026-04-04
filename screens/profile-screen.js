// Porygon Trail - Profile Screen
// Shows per-user stats aggregated from pt_leaderboard + pt_events
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    function mode(arr) {
        if (!arr.length) return null;
        const counts = {};
        arr.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    }

    function stat(label, value) {
        return `
            <div style="display: flex; justify-content: space-between; align-items: baseline;
                        padding: 5px 0; border-bottom: 1px solid var(--gb-light); font-size: 7px;">
                <span style="color: var(--gb-dark);">${label}</span>
                <span style="color: var(--gb-darkest); text-align: right;">${value}</span>
            </div>`;
    }

    PT.Screens.PROFILE = {
        render(container, _state, params) {
            const { userId, username } = params || {};
            const auth = PT.Engine.Auth;
            const client = auth && auth.getClient();

            const div = document.createElement('div');
            div.className = 'screen';
            div.style.cssText = 'padding: 16px; overflow-y: auto;';
            div.innerHTML = `
                <div style="font-size: 10px; text-align: center; margin-bottom: 4px; letter-spacing: 1px;">
                    ${(username || '???').toUpperCase()}
                </div>
                <div style="font-size: 7px; text-align: center; color: var(--gb-dark); margin-bottom: 14px;">
                    TRAINER PROFILE
                </div>
                <div id="profile-stats">
                    <div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">
                        Loading...
                    </div>
                </div>
                <div style="margin-top: 12px;">
                    <button class="btn btn-wide" id="btn-back">BACK</button>
                </div>
            `;
            container.appendChild(div);

            document.getElementById('btn-back').addEventListener('click', () => {
                PT.App.goto('LEADERBOARD');
            });

            if (!client || !userId) {
                document.getElementById('profile-stats').innerHTML =
                    '<div style="text-align:center;padding:20px;font-size:7px;color:var(--gb-dark);">Could not load profile.</div>';
                return;
            }

            // Fetch leaderboard entries + events in parallel
            Promise.all([
                client.from('pt_leaderboard')
                    .select('score, pokedex_count, badges, days_elapsed, won')
                    .eq('user_id', userId),
                client.from('pt_events')
                    .select('event_type, payload')
                    .eq('user_id', userId)
            ]).then(([lbRes, evRes]) => {
                const el = document.getElementById('profile-stats');
                if (!el) return;

                if (lbRes.error && evRes.error) {
                    el.innerHTML = '<div style="text-align:center;padding:20px;font-size:7px;color:var(--gb-dark);">Could not load profile.</div>';
                    return;
                }

                const lbRows = lbRes.data || [];
                const events = evRes.data || [];

                const gameStarts  = events.filter(e => e.event_type === 'game_start');
                const gameOvers   = events.filter(e => e.event_type === 'game_over');
                const victories   = events.filter(e => e.event_type === 'victory');

                // ── Total Runs (prefer event count, fall back to leaderboard)
                const totalRuns = gameStarts.length || lbRows.length;

                // ── E4 Wins
                const e4Wins = victories.length || lbRows.filter(r => r.won).length;

                // ── High Score
                const allScores = lbRows.map(r => r.score);
                const highScore = allScores.length ? Math.max(...allScores).toLocaleString() : '--';

                // ── Pokedex Best (highest single-run count)
                const dexCounts = [
                    ...lbRows.map(r => r.pokedex_count),
                    ...gameOvers.map(e => e.payload?.pokedex_count || 0),
                    ...victories.map(e => e.payload?.pokedex_count || 0)
                ].filter(n => n > 0);
                const bestDex = dexCounts.length ? `${Math.max(...dexCounts)}/151` : '--';

                // ── Pokedex Champs (unique pokemon IDs across all victories)
                const champIdSets = victories
                    .map(e => e.payload?.champion_ids || [])
                    .flat();
                const uniqueChamps = new Set(champIdSets).size;
                const pokedexChamps = uniqueChamps ? `${uniqueChamps}/151` : '--';

                // ── Legendaries Caught (best single run)
                const legCounts = [
                    ...gameOvers.map(e => e.payload?.legendary_caught),
                    ...victories.map(e => e.payload?.legendary_caught)
                ].filter(n => n != null && n > 0);
                const legCaught = legCounts.length ? Math.max(...legCounts) : '--';

                // ── Legendary Champs (unique legendary IDs across all victories)
                const legChampIds = victories
                    .map(e => e.payload?.legendary_champ_ids || [])
                    .flat();
                const legChamps = legChampIds.length ? new Set(legChampIds).size : '--';

                // ── Favorite Starter
                const starterNames = gameStarts.map(e => e.payload?.starter_name).filter(Boolean);
                const favStarter = starterNames.length ? mode(starterNames) : '--';

                // ── Most Common Death Location
                const deathRoutes = gameOvers.map(e => e.payload?.route).filter(Boolean);
                const deathSpot = deathRoutes.length ? mode(deathRoutes) : '--';

                // ── Furthest Run (max route_index from game_overs; victories = end of trail)
                const furthestFromLosses = gameOvers
                    .map(e => ({ idx: e.payload?.route_index ?? -1, name: e.payload?.route }))
                    .filter(r => r.idx >= 0);
                const hasWin = victories.length > 0;
                let furthestRun = '--';
                if (hasWin) {
                    furthestRun = 'Indigo Plateau ★';
                } else if (furthestFromLosses.length) {
                    const best = furthestFromLosses.sort((a, b) => b.idx - a.idx)[0];
                    furthestRun = best.name || '--';
                }

                // ── Fastest Win (min days_elapsed from victories)
                const winDays = victories.map(e => e.payload?.days_elapsed).filter(n => n > 0);
                const fastestWin = winDays.length ? `Day ${Math.min(...winDays)}` : '--';

                el.innerHTML =
                    stat('TOTAL RUNS', totalRuns || '--') +
                    stat('TOTAL E4 WINS', e4Wins || '--') +
                    stat('POKÉDEX BEST', bestDex) +
                    stat('POKÉDEX CHAMPS', pokedexChamps) +
                    stat('LEGENDARIES CAUGHT', legCaught) +
                    stat('LEGENDARY CHAMPS', legChamps) +
                    stat('HIGH SCORE', highScore) +
                    stat('FAVORITE STARTER', favStarter) +
                    stat('MOST DEATHS AT', deathSpot) +
                    stat('FURTHEST RUN', furthestRun) +
                    stat('FASTEST WIN', fastestWin);

            }).catch(() => {
                const el = document.getElementById('profile-stats');
                if (el) el.innerHTML = '<div style="text-align:center;padding:20px;font-size:7px;color:var(--gb-dark);">Could not load profile.</div>';
            });
        }
    };
})();
