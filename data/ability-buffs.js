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
})();
