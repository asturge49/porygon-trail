// Porygon Trail - Hall of Fame Screen
// Shows the 5 most recent winning parties (the team that beat the Elite Four)
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.HALLOFFAME = {
        render(container) {
            const r = PT.Engine.Records.getRecords();
            const entries = r.hallOfFame || [];

            const div = document.createElement('div');
            div.className = 'screen halloffame-screen';
            div.innerHTML = `
                <div class="panel-header text-center">HALL OF FAME</div>
                <div style="font-size: 7px; text-align: center; margin-bottom: 6px; color: var(--gb-dark);">
                    Most recent champion${entries.length !== 1 ? 's' : ''}
                </div>
                <div style="max-height: 320px; overflow-y: auto;">
                    ${entries.length === 0
                        ? '<div style="text-align: center; padding: 40px; font-size: 8px; color: var(--gb-dark);">No champions yet!<br>Beat the Elite Four to be enshrined.</div>'
                        : entries.map(entry => `
                            <div class="text-box" style="margin-bottom: 6px;">
                                <div style="font-size: 7px; margin-bottom: 4px;">${entry.name} — ${entry.date}</div>
                                <div class="hall-of-fame-team">
                                    ${entry.team.map(p => `
                                        <div class="hof-pokemon">
                                            <img class="hof-sprite" src="${p.spriteUrl}" alt="${p.name}"
                                                 onerror="this.style.display='none'">
                                            <div class="hof-name">${p.name}</div>
                                            ${p.battleStars > 0 ? `<div style="font-size: 6px; color: #b8860b;">${'★'.repeat(p.battleStars)}</div>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
                <button class="btn btn-wide" id="btn-back">BACK</button>
            `;
            container.appendChild(div);

            document.getElementById('btn-back').addEventListener('click', () => {
                if (PT.App.screenStack.length > 0) {
                    PT.App.pop();
                } else {
                    PT.App.goto('RECORDS');
                }
            });
        }
    };
})();
