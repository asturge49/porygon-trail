// Porygon Trail - Records Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    function fmt(rec) {
        if (!rec) return '---';
        return `${rec.value}`;
    }

    function fmtBy(rec) {
        if (!rec) return '';
        return `${rec.name} — ${rec.date}`;
    }

    // Find the top entry from a tally map { id: count }
    // Returns { id, count } or null
    function topTally(tally) {
        if (!tally) return null;
        const entries = Object.entries(tally);
        if (entries.length === 0) return null;
        entries.sort((a, b) => b[1] - a[1]);
        return { id: entries[0][0], count: entries[0][1] };
    }

    // Find top entry from a string-keyed tally { name: count }
    function topStringTally(tally) {
        if (!tally) return null;
        const entries = Object.entries(tally);
        if (entries.length === 0) return null;
        entries.sort((a, b) => b[1] - a[1]);
        return { name: entries[0][0], count: entries[0][1] };
    }

    function pokemonName(id) {
        const p = PT.Data.Pokemon.find(pk => pk.id === parseInt(id));
        return p ? p.name : '???';
    }

    PT.Screens.RECORDS = {
        render(container) {
            const r = PT.Engine.Records.getRecords();
            const winRate = r.totalRuns > 0 ? Math.round((r.totalWins / r.totalRuns) * 100) : 0;

            // Compute tally-based stats
            const favStarter = topTally(r.starterTally);
            const favCatch = topTally(r.catchTally);
            const topDeathLoc = topStringTally(r.deathLocationTally);

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
                    ${recordRow('⚡', 'FASTEST WIN', r.fastestWin ? r.fastestWin.value + ' days' : '---', fmtBy(r.fastestWin))}
                    ${recordRow('🐢', 'SLOWEST WIN', r.slowestWin ? r.slowestWin.value + ' days' : '---', fmtBy(r.slowestWin))}
                    ${recordRow('📖', 'MOST CATCHES', r.mostCatches ? fmt(r.mostCatches) + ' pokemon' : '---', fmtBy(r.mostCatches))}
                    ${recordRow('🎯', 'FEWEST CATCHES WIN', r.fewestCatchesWin ? fmt(r.fewestCatchesWin) + ' pokemon' : '---', fmtBy(r.fewestCatchesWin))}
                    ${recordRow('🔴', 'FAVOURITE STARTER', favStarter ? pokemonName(favStarter.id) : '---', favStarter ? 'Picked ' + favStarter.count + ' time' + (favStarter.count !== 1 ? 's' : '') : '')}
                    ${recordRow('🧲', 'MOST CAUGHT MON', favCatch ? pokemonName(favCatch.id) : '---', favCatch ? 'Caught ' + favCatch.count + ' time' + (favCatch.count !== 1 ? 's' : '') + ' across all runs' : '')}
                    ${recordRow('👑', 'LEGENDARY CATCHES', (r.totalLegendaryCatches || 0) > 0 ? r.totalLegendaryCatches + ' total' : '---', (r.totalLegendaryCatches || 0) > 0 ? 'Across all runs' : '')}
                    ${recordRow('💀', 'MOST LOSSES', r.mostLosses ? fmt(r.mostLosses) + ' pokemon' : '---', fmtBy(r.mostLosses))}
                    ${recordRow('✨', 'PERFECT RUNS', r.perfectRuns > 0 ? r.perfectRuns + 'x' : '---', r.perfectRuns > 0 ? 'Won with zero deaths' : '')}
                    ${recordRow('👥', 'FULL ROSTER WINS', r.fullRosterWins > 0 ? r.fullRosterWins + 'x' : '---', r.fullRosterWins > 0 ? 'Won with all 6 alive' : '')}
                    ${recordRow('💰', 'RICHEST ENDING', r.richestEnding ? '$' + r.richestEnding.value.toLocaleString() : '---', fmtBy(r.richestEnding))}
                    ${recordRow('📅', 'LONGEST RUN', r.longestRun ? r.longestRun.value + ' days' : '---', fmtBy(r.longestRun))}
                    ${recordRow('💔', 'SHORTEST DEATH', r.shortestDeath ? r.shortestDeath.value + ' days' : '---', fmtBy(r.shortestDeath))}
                    ${recordRow('🗺️', 'FURTHEST DEATH', r.furthestDeath ? r.furthestDeath.value : '---', fmtBy(r.furthestDeath))}
                    ${recordRow('☠️', 'MOST COMMON DEATH', topDeathLoc ? topDeathLoc.name : '---', topDeathLoc ? topDeathLoc.count + ' run' + (topDeathLoc.count !== 1 ? 's' : '') + ' ended here' : '')}
                    ${recordRow('🎖️', 'MOST BADGES', r.mostBadges ? fmt(r.mostBadges) + '/9' : '---', fmtBy(r.mostBadges))}
                    ${recordRow('🥊', 'MOST GYM WINS', r.mostGymWins ? fmt(r.mostGymWins) : '---', fmtBy(r.mostGymWins))}
                    ${recordRow('🚀', 'MOST ROCKET DEFEATS', r.mostRocketDefeats ? fmt(r.mostRocketDefeats) : '---', fmtBy(r.mostRocketDefeats))}
                    ${recordRow('⭐', 'MOST BATTLE STARS', r.mostStars ? fmt(r.mostStars) : '---', fmtBy(r.mostStars))}
                </div>
                <div class="btn-row" style="width: 100%; max-width: 500px; margin-top: 6px;">
                    <button class="btn flex-1" id="btn-back">BACK</button>
                    <button class="btn flex-1 btn-small" id="btn-clear">CLEAR RECORDS</button>
                </div>
            `;
            container.appendChild(div);

            document.getElementById('btn-back').addEventListener('click', () => {
                PT.App.goto('TITLE');
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
