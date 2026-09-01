// Porygon Trail - Guide Screen (Abilities / Scoring / Items reference)
// Static reference content — no state dependency, so it works identically
// from the title screen (no run in progress) and the in-game menu.
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    let currentTab = 'abilities';

    // Travel abilities (data/pokemon.js's travelAbility field) — every
    // distinct value that appears across the dex, described in plain
    // player-facing terms. Mechanics sourced directly from
    // engine/travel-engine.js, engine/encounter-engine.js, engine/event-engine.js,
    // and engine/game-state.js's getAbilityPower/hasAbility, not guessed.
    // Ordered roughly common -> rare (legendary-exclusive abilities last).
    const ABILITIES = [
        { name: 'Surf', desc: 'Covers extra ground on water routes.' },
        { name: 'Strength', desc: 'Lowers the injury risk of a grueling Push pace.' },
        { name: 'Psychic', desc: 'A chance to sense two paths ahead, letting you choose between two wild encounters or events.' },
        { name: 'Fly', desc: 'Covers extra ground every day.' },
        { name: 'Flash', desc: 'A chance to find hidden money, a Potion, or Poke Balls on the trail.' },
        { name: 'Cut', desc: 'A chance to forage extra food along the way.' },
        { name: 'Poison', desc: 'Improves your odds in battle-style events and gym fights.' },
        { name: 'Guard', desc: 'A chance to block a Push-pace injury entirely.' },
        { name: 'Fire', desc: "Reduces how much food your party eats each day." },
        { name: 'Heal', desc: 'A passive chance to nurse an injured teammate back to health.' },
        { name: 'Dig', desc: 'Guarantees a successful escape from a wild Pokemon.' },
        { name: 'Intimidate', desc: 'Boosts both your catch rate and your battle odds.' },
        { name: 'Miracle', pokemon: 'Mew', desc: 'Every day, a random bonus — a full heal, free food, money, items, bonus distance, or a Battle Star.' },
        { name: 'Sacred Flame', pokemon: 'Moltres', desc: 'Your party eats no food at all.' },
        { name: 'Mimic', pokemon: 'Ditto', desc: "Copies whichever ability your strongest teammate already has active, adding its own power on top." },
        { name: 'Thunderclap', pokemon: 'Zapdos', desc: 'Doubles how far you travel every day.' },
        { name: 'System Restore', pokemon: 'Porygon', desc: 'Revives a fainted Pokemon from the brink — once per run.' },
        { name: 'Safeguard', pokemon: 'Chansey', desc: 'Saves a Pokemon from fainting — once per Pokemon, for the whole run.' },
        { name: 'Psychic Dominance', pokemon: 'Mewtwo', desc: 'A massive +50% win chance in every battle.' },
        { name: 'Pay Day', desc: 'Boosts every money reward you earn.' },
        { name: 'Glitch', pokemon: 'MissingNo.', desc: 'Unpredictable — duplicates items, conjures money, heals, or deals stray damage.' },
        { name: 'Aurora Veil', pokemon: 'Articuno', desc: 'Softens every hit your party takes by 1 damage.' }
    ];

    const ABILITY_NOTE = "An ability's strength grows with its Pokemon's evolution stage and Battle Stars, and starter-line Pokemon carry double weight. Teammates who share an ability stack their power together.";

    // Point values sourced directly from engine/scoring.js's calculateScore —
    // kept in sync by hand since this is reference text, not the formula itself.
    const SCORING_SECTIONS = [
        {
            title: 'Victory & Completion',
            rows: [
                { label: "Beat Kanto's Elite Four", value: '+2,000', sub: 'Plus up to +5,000 for finishing Kanto within 100 days.' },
                { label: "Beat Johto's Elite Four (rematch)", value: '+2,000', sub: 'Plus up to +5,000 for finishing Johto within 100 days of entering it.' },
                { label: 'Beat Red at Mt. Silver', value: '+2,000', sub: 'The full-game victory bonus, plus up to +5,000 for finishing the whole run within 100 days.' },
                { label: 'Champion badge', value: '+500', sub: 'Earned the moment either Elite Four falls.' },
                { label: "Each of Red's Pokemon defeated", value: '+500', sub: 'Up to +3,000 for all six — counts even on a loss.' }
            ]
        },
        {
            title: 'Team & Catches',
            rows: [
                { label: 'Each Pokemon in your Pokedex', value: '+30' },
                { label: 'Each Rare Pokemon caught', value: '+75' },
                { label: 'Each Legendary Pokemon caught', value: '+200' },
                { label: 'Each healthy Pokemon at run\'s end', value: '+100' },
                { label: 'Each gym badge', value: '+150' },
                { label: 'Each Team Rocket defeat', value: '+50' }
            ]
        },
        {
            title: 'Travel & Resources',
            rows: [
                { label: 'Distance traveled', value: '+5', sub: 'Per 5 miles covered.' },
                { label: 'Leftover money, food, Poke Balls & Rare Candy', value: 'varies', sub: 'Unspent resources at run\'s end convert to bonus points.' }
            ]
        },
        {
            title: 'Penalties',
            rows: [
                { label: 'Each fainted Pokemon', value: '-50' },
                { label: 'Each wasted Poke Ball', value: '-3' }
            ]
        }
    ];

    function renderTabs() {
        return `
            <div class="leaderboard-tabs">
                <button class="leaderboard-tab ${currentTab === 'abilities' ? 'active' : ''}" data-tab="abilities">ABILITIES</button>
                <button class="leaderboard-tab ${currentTab === 'scoring' ? 'active' : ''}" data-tab="scoring">SCORING</button>
                <button class="leaderboard-tab ${currentTab === 'items' ? 'active' : ''}" data-tab="items">ITEMS</button>
            </div>
        `;
    }

    function renderAbilities() {
        return `
            <div style="font-size: 6px; color: #000; padding: 6px; text-align: center;">${ABILITY_NOTE}</div>
            <div class="records-list">
                ${ABILITIES.map(a => `
                    <div class="record-row">
                        <div class="record-label">${a.name.toUpperCase()}${a.pokemon ? ` — ${a.pokemon}` : ''}</div>
                        <div class="record-sub" style="margin-top: 3px;">${a.desc}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderScoring() {
        return `
            <div class="records-list">
                ${SCORING_SECTIONS.map(section => `
                    <div class="record-row" style="background: var(--gb-dark); padding: 4px 6px;">
                        <div class="record-label" style="color: var(--gb-white);">${section.title}</div>
                    </div>
                    ${section.rows.map(r => `
                        <div class="record-row" style="display: flex; justify-content: space-between; align-items: baseline; gap: 6px;">
                            <div>
                                <div class="record-value" style="font-size: 7px;">${r.label}</div>
                                ${r.sub ? `<div class="record-sub">${r.sub}</div>` : ''}
                            </div>
                            <div class="record-value" style="white-space: nowrap;">${r.value}</div>
                        </div>
                    `).join('')}
                `).join('')}
            </div>
        `;
    }

    function renderItems() {
        const shopItems = Object.keys(PT.Data.Items).map(key => PT.Data.Items[key]);
        const keyItems = (PT.Data.KeyItemOrder || Object.keys(PT.Data.KeyItems)).map(key => PT.Data.KeyItems[key]).filter(Boolean);

        return `
            <div class="record-row" style="background: var(--gb-dark); padding: 4px 6px;">
                <div class="record-label" style="color: var(--gb-white);">Shop Items</div>
            </div>
            <div class="records-list">
                ${shopItems.map(item => `
                    <div class="record-row" style="display: flex; justify-content: space-between; align-items: baseline; gap: 6px;">
                        <div>
                            <div class="record-value" style="font-size: 7px;">${item.icon} ${item.name}</div>
                            <div class="record-sub">${item.desc}</div>
                        </div>
                        <div class="record-value" style="white-space: nowrap;">$${item.price}</div>
                    </div>
                `).join('')}
            </div>
            <div class="record-row" style="background: var(--gb-dark); padding: 4px 6px; margin-top: 6px;">
                <div class="record-label" style="color: var(--gb-white);">Gym Reward Items</div>
            </div>
            <div style="font-size: 6px; color: #000; padding: 6px; text-align: center;">Every gym win offers a choice of 3 of these. Picking the same one again stacks its bonus.</div>
            <div class="records-list">
                ${keyItems.map(item => `
                    <div class="record-row">
                        <div class="record-value" style="font-size: 7px;">${item.name}</div>
                        <div class="record-sub" style="margin-top: 2px;">${item.desc}</div>
                        <div class="record-sub" style="margin-top: 1px; color: var(--gb-darkest);">${item.buffLabel}${item.maxStacks ? ` (max ${item.maxStacks}x)` : ''}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderContent() {
        if (currentTab === 'scoring') return renderScoring();
        if (currentTab === 'items') return renderItems();
        return renderAbilities();
    }

    PT.Screens.GUIDE = {
        render(container) {
            currentTab = 'abilities';
            const div = document.createElement('div');
            div.className = 'screen guide-screen';
            div.innerHTML = `
                <div class="panel-header text-center">GUIDE</div>
                ${renderTabs()}
                <div id="guide-content" style="font-size: 7px; max-height: 300px; overflow-y: auto; margin-top: 6px;">
                    ${renderContent()}
                </div>
                <div class="btn-row" style="width: 100%; max-width: 500px; margin-top: 6px;">
                    <button class="btn flex-1" id="btn-guide-back">BACK</button>
                </div>
            `;
            container.appendChild(div);

            function refresh() {
                document.querySelectorAll('.leaderboard-tab[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === currentTab));
                document.getElementById('guide-content').innerHTML = renderContent();
            }

            div.querySelectorAll('.leaderboard-tab[data-tab]').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (currentTab === btn.dataset.tab) return;
                    currentTab = btn.dataset.tab;
                    refresh();
                });
            });

            document.getElementById('btn-guide-back').addEventListener('click', () => {
                if (PT.App.screenStack.length > 0) {
                    PT.App.pop();
                } else {
                    PT.App.goto('TITLE');
                }
            });
        }
    };
})();
