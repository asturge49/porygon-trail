// Porygon Trail - Johto Debug Harness (§14.2)
// Staging-only entry point that drops a save directly into Johto with a
// curated party/items/buffs preset, skipping a full Kanto playthrough — for
// reproducible Johto playtesting. Mirrors the three carryover profiles used
// by the automated §16 playtesting pass (full-strong/mid-attrition/scraped-by),
// so what a tester sees here lines up with what was actually measured.
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    const KANTO_BADGES = ['Boulder Badge', 'Cascade Badge', 'Thunder Badge', 'Rainbow Badge',
        'Marsh Badge', 'Soul Badge', 'Volcano Badge', 'Earth Badge'];

    const PROFILES = {
        'full-strong': {
            label: 'FULL-STRONG',
            desc: '6 Pokemon, all final evolutions, 3 stars each, well-stocked.',
            // Venusaur(cut) / Charizard(fire) / Pidgeot(fly) / Gyarados(intimidate) / Snorlax(guard)
            // — deliberately spans the travel abilities that matter most for a
            // long Johto haul (fire trims food use, cut forages it).
            party: [[3, 3], [6, 3], [18, 3], [130, 3], [143, 3]],
            badges: 8,
            resources: { food: 60, pokeballs: 20, greatballs: 10, ultraballs: 3, potions: 8, superPotions: 4, repels: 3, rareCandy: 0, escapeRope: 2, money: 4200 },
            keyItems: { muscleBand: 2, focusBand: 2, sootheBell: 1, amuletCoin: 1, whiteFlute: 1, bicycle: 1 }
        },
        'mid-attrition': {
            label: 'MID-ATTRITION',
            desc: '3-4 Pokemon, mixed evolution stages, moderate resources.',
            // Fearow(fly,2*) / Nidoking(poison,1*) / Wartortle(surf, mid-evo) / Kadabra(psychic, mid-evo)
            // — mid-evolutions legitimately hold 0 stars; only finals can earn them.
            party: [[22, 2], [34, 1], [8, 0], [64, 0]],
            badges: 6,
            resources: { food: 30, pokeballs: 10, greatballs: 4, ultraballs: 0, potions: 4, superPotions: 1, repels: 1, rareCandy: 0, escapeRope: 1, money: 2000 },
            keyItems: { muscleBand: 1, focusBand: 1, sootheBell: 1, bicycle: 1 }
        },
        'scraped-by': {
            label: 'SCRAPED-BY',
            desc: '1 Pokemon, minimal stars, minimal resources.',
            party: [[20, 1]], // Raticate(dig,1*)
            badges: 5,
            resources: { food: 14, pokeballs: 4, greatballs: 0, ultraballs: 0, potions: 2, superPotions: 0, repels: 0, rareCandy: 0, escapeRope: 0, money: 700 },
            keyItems: { muscleBand: 1 }
        }
    };

    PT.Screens.JOHTODEBUG = {
        render(container) {
            const GS = PT.Engine.GameState;
            const div = document.createElement('div');
            div.className = 'screen starter-screen';
            div.innerHTML = `
                <div class="text-box">
                    <p><strong>JOHTO DEBUG HARNESS</strong> (staging only)</p>
                    <p style="margin-top: 6px;">Drops you straight into Johto with a curated
                    party — skips Kanto entirely. Pick a carryover profile:</p>
                </div>
                <div id="profile-choices">
                    ${Object.keys(PROFILES).map(key => `
                        <button class="btn btn-wide" data-profile="${key}" style="text-align:left; margin-bottom:6px;">
                            <strong>${PROFILES[key].label}</strong><br>
                            <span style="font-size:6px; font-weight:normal;">${PROFILES[key].desc}</span>
                        </button>
                    `).join('')}
                </div>
                <button class="btn btn-wide btn-small" id="btn-debug-back" style="margin-top:8px;">BACK</button>
            `;
            container.appendChild(div);

            document.querySelectorAll('[data-profile]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const state = buildJohtoState(btn.dataset.profile, GS);
                    PT.State = state;
                    GS.saveGame(state);
                    // Route through the real Elm starter picker (screens/johto-starter-screen.js)
                    // rather than auto-assigning one, so the debug harness exercises the
                    // same flow a real Kanto->Johto transition would.
                    PT.App.goto('ELMSTARTER');
                });
            });

            document.getElementById('btn-debug-back').addEventListener('click', () => {
                PT.App.goto('TITLE');
            });
        }
    };

    function buildJohtoState(profileKey, GS) {
        const cfg = PROFILES[profileKey];
        const johtoStartIndex = PT.Data.Routes.findIndex(r => r.id === 'new_bark_town');

        const state = GS.createNewGame('TESTER', 1);
        state.party = [];
        state.pokedexCaught = [];
        state.pokedexSeen = [];

        // Build the Kanto-carried roster first, while region is still 'kanto',
        // so each mon's spriteGen freezes to Gen I art (§4.1's catch-region rule).
        state.region = 'kanto';
        cfg.party.forEach(([id, stars]) => {
            const data = PT.Data.Pokemon.find(p => p.id === id);
            if (!data) return;
            const mon = GS.createPartyPokemon(data, state);
            mon.battleStars = stars;
            mon.battleWins = stars;
            state.party.push(mon);
            state.pokedexCaught.push(id);
            state.pokedexSeen.push(id);
        });

        // Now "enter" Johto — everything from here on is a Johto-region catch.
        state.daysElapsed = 100; // a realistic completed-Kanto-run day count
        state.region = 'johto';
        state.completedRegions = ['kanto'];
        state.johtoE4Cleared = false;
        state.daysElapsedAtJohtoEntry = state.daysElapsed;
        state.badges = KANTO_BADGES.slice(0, cfg.badges).concat(['champion']);
        state.gymBattlesWon = cfg.badges;

        state.resources = Object.assign({}, cfg.resources);
        state.buffs = GS.createDefaultBuffs();
        Object.keys(cfg.keyItems).forEach(k => {
            state.buffs.keyItems[k] = cfg.keyItems[k];
            state.keyItems.push(k);
        });

        // Sit one location short of New Bark Town — ELMSTARTER's own
        // enterJohto() does currentLocationIndex++ after the player picks a
        // starter, exactly like the real post-E4 flow. Landing here directly
        // would skip that increment and land a location early.
        state.currentLocationIndex = johtoStartIndex > 0 ? johtoStartIndex - 1 : 0;
        state.distanceTraveled = 0;

        return state;
    }
})();
