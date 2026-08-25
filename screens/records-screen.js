// Porygon Trail - Records Screen
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

    PT.Screens.RECORDS = {
        render(container) {
            const r = PT.Engine.Records.getRecords();
            const winRate = r.totalRuns > 0 ? Math.round((r.totalWins / r.totalRuns) * 100) : 0;
            const favCatch = topTally(r.catchTally);

            const dex = PT.Engine.Scoring.getGlobalPokedex();
            const totalDex = PT.Data.Pokemon.length;
            const dexCaught = dex.caught.length;
            const dexPct = totalDex > 0 ? Math.round((dexCaught / totalDex) * 100) : 0;
            const champCount = dex.champions.length;

            const div = document.createElement('div');
            div.className = 'screen records-screen';
            div.innerHTML = `
                <div class="panel-header text-center">TRAINER RECORDS</div>
                <div style="font-size: 7px; text-align: center; margin-bottom: 6px; color: var(--gb-dark);">
                    ${r.totalRuns} run${r.totalRuns !== 1 ? 's' : ''} | ${r.totalWins} win${r.totalWins !== 1 ? 's' : ''} | ${winRate}% win rate
                </div>
                <div class="records-list" style="font-size: 7px; max-height: 280px; overflow-y: auto;">
                    ${recordRow('🎮', 'TOTAL RUNS', r.totalRuns > 0 ? r.totalRuns : '---', r.totalRuns > 0 ? r.totalWins + ' win' + (r.totalWins !== 1 ? 's' : '') + ' | ' + (r.totalRuns - r.totalWins) + ' loss' + ((r.totalRuns - r.totalWins) !== 1 ? 'es' : '') + ' | ' + winRate + '% win rate' : '')}
                    ${recordRow('🏆', 'HIGH SCORE', r.highScore ? r.highScore.value.toLocaleString() : '---', fmtBy(r.highScore))}
                    ${recordRow('📚', 'POKEDEX COMPLETION', dexCaught > 0 ? dexPct + '% (' + dexCaught + '/' + totalDex + ')' : '---', dexCaught > 0 ? 'Across all runs' : '')}
                    ${recordRow('🏅', 'CHAMPION POKEMON', champCount > 0 ? champCount + '/' + totalDex : '---', champCount > 0 ? 'Survived an Elite Four win' : '')}
                    ${recordRow('⚡', 'FASTEST WIN', r.fastestWin ? r.fastestWin.value + ' days' : '---', fmtBy(r.fastestWin))}
                    ${recordRow('🐢', 'SLOWEST WIN', r.slowestWin ? r.slowestWin.value + ' days' : '---', fmtBy(r.slowestWin))}
                    ${recordRow('📖', 'MOST CATCHES IN A RUN', r.mostCatches ? r.mostCatches.value + ' pokemon' : '---', fmtBy(r.mostCatches))}
                    ${recordRow('🎯', 'FEWEST CATCHES IN A WIN', r.fewestCatchesWin ? r.fewestCatchesWin.value + ' pokemon' : '---', fmtBy(r.fewestCatchesWin))}
                    ${recordRow('🧲', 'MOST CAUGHT MON (NON STARTER)', favCatch ? pokemonName(favCatch.id) : '---', favCatch ? 'Caught ' + favCatch.count + ' time' + (favCatch.count !== 1 ? 's' : '') + ' across all runs' : '')}
                    ${recordRow('👑', 'LEGENDARIES CAUGHT', (r.totalLegendaryCatches || 0) > 0 ? r.totalLegendaryCatches + ' total' : '---', (r.totalLegendaryCatches || 0) > 0 ? 'Across all runs' : '')}
                    ${recordRow('💰', 'RICHEST ENDING', r.richestEnding ? '$' + r.richestEnding.value.toLocaleString() : '---', fmtBy(r.richestEnding))}
                </div>
                <div class="btn-row" style="width: 100%; max-width: 500px; margin-top: 6px;">
                    <button class="btn flex-1" id="btn-back">BACK</button>
                    <button class="btn flex-1" id="btn-hof">HALL OF FAME</button>
                </div>
                <div class="btn-row" style="width: 100%; max-width: 500px; margin-top: 4px;">
                    <button class="btn flex-1 btn-small" id="btn-clear">CLEAR RECORDS</button>
                </div>
            `;
            container.appendChild(div);

            document.getElementById('btn-back').addEventListener('click', () => {
                if (PT.App.screenStack.length > 0) {
                    PT.App.pop();
                } else {
                    PT.App.goto('TITLE');
                }
            });
            document.getElementById('btn-hof').addEventListener('click', () => {
                PT.App.push('HALLOFFAME');
            });
            document.getElementById('btn-clear').addEventListener('click', () => {
                if (confirm('Clear all records? This cannot be undone.')) {
                    PT.Engine.Records.clearRecords();
                    PT.App.goto('RECORDS');
                }
            });
        }
    };

    function recordRow(icon, label, value, sub) {
        return `
            <div class="record-row">
                <div class="record-label">${icon} ${label}</div>
                <div class="record-value">${value}</div>
                ${sub ? `<div class="record-sub">${sub}</div>` : ''}
            </div>
        `;
    }
})();
