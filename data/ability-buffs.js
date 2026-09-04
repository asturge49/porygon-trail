// Porygon Trail - Ability Buffs (gym reward pool)
// Player-chosen stacking boosts to travel abilities already present in the
// party. A boost only takes effect while a party Pokemon currently holds
// the matching travelAbility — see PT.Engine.GameState.getAbilityPower.
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    PT.Data.AbilityBuffs = {
        poison: { name: "Poison", desc: "+ battle win chance from Poison-types" },
        intimidate: { name: "Intimidate", desc: "+ battle win chance from Intimidate" },
        cut: { name: "Cut", desc: "+ food foraged while traveling" },
        fly: { name: "Fly", desc: "+ bonus travel distance" },
        surf: { name: "Surf", desc: "+ speed crossing water routes" },
        strength: { name: "Strength", desc: "+ injury resistance on grueling pace" },
        flash: { name: "Flash", desc: "+ chance to find hidden stashes" },
        guard: { name: "Guard", desc: "+ chance to block travel injuries" },
        psychic: { name: "Psychic", desc: "+ chance to foresee encounters/events" }
    };

    // Buffable ability pool, in stat-screen display order
    PT.Data.AbilityBuffOrder = ["poison", "intimidate", "cut", "fly", "surf", "strength", "flash", "guard", "psychic"];

    // Plain-English description of every travelAbility's base effect (not the
    // stacking buff amount above) — every party Pokemon has one of these,
    // not just the 9 that are buffable. Single shared source for anywhere
    // that needs to explain what an ability actually does (was previously
    // duplicated identically in screens/travel-screen.js and
    // screens/pokedex-screen.js).
    PT.Data.AbilityDescriptions = {
        cut: 'Forages extra food while traveling',
        surf: 'Bonus miles on water routes',
        fly: 'Scouts shortcuts for bonus miles',
        strength: 'Reduces injury chance on risky travel',
        flash: 'Finds hidden money and items',
        dig: 'Guarantees escape from wild encounters',
        fire: 'Efficient cooking saves food',
        heal: 'Passively heals injured party members',
        psychic: 'Foresight: choose between encounters/events',
        poison: 'Battle win bonus',
        guard: 'Chance to block injuries entirely',
        intimidate: 'Catch rate bonus + battle win bonus',
        payday: 'Bonus money on all rewards',
        safeguard: 'Saves a Pokemon from death once',
        system_restore: 'Revive one lost Pokemon (once per game)',
        glitch: 'Unpredictable chaos effects',
        mimic: 'Copies the strongest ability in your party',
        aurora_veil: 'All party damage reduced by 1',
        thunderclap: 'Double travel distance on all paces',
        sacred_flame: 'Zero food consumption',
        psychic_dominance: '+50% win chance on all battles',
        miracle: 'Random powerful bonus effect every day'
    };
})();
