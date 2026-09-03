// Porygon Trail - Battle Outcome UI
//
// Shared "what determined this fight" panel for every battle-resolution
// screen (gyms, gauntlet, Elite Four, Red's capstone, wild encounters,
// event/Rocket battles). Previously each of those 5 files built its own
// win/loss HTML from scratch (this codebase's usual "duplicate small
// helpers for independence" convention), and the win-chance math was
// buried in a single 6px footer line like "Win chance was 29% (Pokemon 1
// penalty -5%, POISON +1%)" — the actual levers (type matchup, badges,
// which items do/don't apply here) were either crammed into one run-on
// string or entirely invisible. This is a genuine near-duplicate across
// all 5 contexts (see PT.Engine.BattleOutcomeUI usage in each), so it's
// pulled into one shared renderer instead of copy-pasted a 6th time.
//
// Callers build a `breakdown` array as they compute `chance` — one row
// per term that actually changed the number (base chance, type match,
// badges, each ability, Muscle Band, star bonus, ...) — instead of the
// old flat array of pre-formatted strings. This module turns that into
// a meter + itemized list; it does no battle math of its own.
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    // config = {
    //   chance: number (final, clamped),
    //   maxed: 'capped' | 'floored' | null — whether clamping changed the raw total,
    //   rows: [{ label: string, value: number }] — signed contributions, in the
    //     order they were applied. `value` of 0 is allowed (e.g. a badge count
    //     of 0) and still renders, since "this lever exists and did nothing"
    //     is itself useful information.
    //   notApplicable: [string] (optional) — items/abilities the player owns
    //     that have no effect in this specific battle context, e.g. "MUSCLE
    //     BAND" in an Elite Four or Red fight. Each renders as its own row
    //     with a fixed explanatory suffix, not a bare label.
    //   quote: string (optional) — de-emphasized trainer/leader flavor line.
    // }
    function renderBreakdown(config) {
        const chance = config.chance;
        const rows = config.rows || [];
        const notApplicable = config.notApplicable || [];
        const maxedLabel = config.maxed === 'capped' ? 'MAXED OUT'
            : config.maxed === 'floored' ? 'FLOORED OUT'
            : null;

        const rowsHtml = rows.map(r => {
            const sign = r.value > 0 ? '+' : '';
            return `
                <div class="battle-breakdown-row">
                    <span class="battle-breakdown-label">${r.label}</span>
                    <span class="battle-breakdown-value">${sign}${r.value}%</span>
                </div>`;
        }).join('');

        const naHtml = notApplicable.map(label => `
            <div class="battle-breakdown-row battle-breakdown-na">
                <span class="battle-breakdown-label">${label}</span>
                <span class="battle-breakdown-value">n/a</span>
            </div>`).join('');

        return `
            <div class="battle-outcome-panel">
                <div class="battle-outcome-meter-label">
                    WIN CHANCE: ${chance}%${maxedLabel ? ` <span class="battle-outcome-maxed">(${maxedLabel})</span>` : ''}
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${chance}%;"></div>
                </div>
                <div class="battle-breakdown-list">
                    ${rowsHtml}
                    ${naHtml}
                </div>
                ${config.quote ? `<div class="battle-outcome-quote">"${config.quote}"</div>` : ''}
            </div>
        `;
    }

    PT.Engine.BattleOutcomeUI = { renderBreakdown };
})();
