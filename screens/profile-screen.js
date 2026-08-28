// Porygon Trail - Profile Screen
// Shows another player's Trainer Records — same stats as your own RECORDS
// screen (engine/records.js `pt_records` + Scoring's `pt_pokedex`), just
// fetched for their user_id instead of read from local storage.
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    function fmtBy(rec) {
        if (!rec) return '';
        return `${rec.name} — ${rec.date}`;
    }

    // Find the top entry from a tally map { id: count }
    function topTally(tally) {
        if (!tally) return null;
        const entries = Object.entries(tally);
        if (entries.length === 0) return null;
        entries.sort((a, b) => b[1] - a[1]);
        return { id: entries[0][0], count: entries[0][1] };
    }

    function pokemonName(id) {
        const p = PT.Data.Pokemon.find(pk => pk.id === parseInt(id));
        return p ? p.name : '???';
    }

    function stat(label, value, sub) {
        return `
            <div style="padding: 5px 0; border-bottom: 1px solid var(--gb-light); font-size: 7px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <span style="color: var(--gb-dark);">${label}</span>
                    <span style="color: var(--gb-darkest); text-align: right;">${value}</span>
                </div>
                ${sub ? `<div style="color: var(--gb-dark); opacity: 0.8; text-align: right;">${sub}</div>` : ''}
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
                    TRAINER RECORDS
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

            // Same two sources engine/records.js and engine/scoring.js sync this
            // user's own RECORDS screen from — fetched here for `userId` instead.
            Promise.all([
                client.from('pt_records').select('records_data').eq('user_id', userId).maybeSingle(),
                client.from('pt_pokedex').select('pokedex_data').eq('user_id', userId).maybeSingle()
            ]).then(([recRes, dexRes]) => {
                const el = document.getElementById('profile-stats');
                if (!el) return;

                if (recRes.error && dexRes.error) {
                    el.innerHTML = '<div style="text-align:center;padding:20px;font-size:7px;color:var(--gb-dark);">Could not load profile.</div>';
                    return;
                }

                const r = recRes.data && recRes.data.records_data
                    ? recRes.data.records_data
                    : { totalRuns: 0, totalWins: 0, catchTally: {} };
                const dex = dexRes.data && dexRes.data.pokedex_data
                    ? dexRes.data.pokedex_data
                    : { seen: [], caught: [], champions: [] };

                const winRate = r.totalRuns > 0 ? Math.round((r.totalWins / r.totalRuns) * 100) : 0;
                const favCatch = topTally(r.catchTally);

                const totalDex = PT.Data.Pokemon.length;
                const dexCaught = (dex.caught || []).length;
                const dexPct = totalDex > 0 ? Math.round((dexCaught / totalDex) * 100) : 0;
                const champCount = (dex.champions || []).length;

                el.innerHTML =
                    stat('TOTAL RUNS', r.totalRuns > 0 ? r.totalRuns : '---',
                        r.totalRuns > 0 ? r.totalWins + ' win' + (r.totalWins !== 1 ? 's' : '') + ' | ' + (r.totalRuns - r.totalWins) + ' loss' + ((r.totalRuns - r.totalWins) !== 1 ? 'es' : '') + ' | ' + winRate + '% win rate' : '') +
                    stat('HIGH SCORE', r.highScore ? r.highScore.value.toLocaleString() : '---', fmtBy(r.highScore)) +
                    stat('POKEDEX COMPLETION', dexCaught > 0 ? dexPct + '% (' + dexCaught + '/' + totalDex + ')' : '---', dexCaught > 0 ? 'Across all runs' : '') +
                    stat('CHAMPION POKEMON', champCount > 0 ? champCount + '/' + totalDex : '---', champCount > 0 ? 'Survived an Elite Four win' : '') +
                    stat('FASTEST WIN', r.fastestWin ? r.fastestWin.value + ' days' : '---', fmtBy(r.fastestWin)) +
                    stat('SLOWEST WIN', r.slowestWin ? r.slowestWin.value + ' days' : '---', fmtBy(r.slowestWin)) +
                    stat('MOST CATCHES IN A RUN', r.mostCatches ? r.mostCatches.value + ' pokemon' : '---', fmtBy(r.mostCatches)) +
                    stat('FEWEST CATCHES IN A WIN', r.fewestCatchesWin ? r.fewestCatchesWin.value + ' pokemon' : '---', fmtBy(r.fewestCatchesWin)) +
                    stat('MOST CAUGHT MON (NON STARTER)', favCatch ? pokemonName(favCatch.id) : '---', favCatch ? 'Caught ' + favCatch.count + ' time' + (favCatch.count !== 1 ? 's' : '') + ' across all runs' : '') +
                    stat('LEGENDARIES CAUGHT', (r.totalLegendaryCatches || 0) > 0 ? r.totalLegendaryCatches + ' total' : '---', (r.totalLegendaryCatches || 0) > 0 ? 'Across all runs' : '') +
                    stat('RICHEST ENDING', r.richestEnding ? '$' + r.richestEnding.value.toLocaleString() : '---', fmtBy(r.richestEnding));

            }).catch(() => {
                const el = document.getElementById('profile-stats');
                if (el) el.innerHTML = '<div style="text-align:center;padding:20px;font-size:7px;color:var(--gb-dark);">Could not load profile.</div>';
            });
        }
    };
})();
