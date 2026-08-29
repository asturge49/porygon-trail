// Porygon Trail - Ability Buffs (gym reward pool)
// Player-chosen stacking boosts to travel abilities already present in the
// party. A boost only takes effect while a party Pokemon currently holds
// the matching travelAbility — see PT.Engine.GameState.getAbilityPower.
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    PT.Data.AbilityBuffs = {
        poison: { name: "Poison", emoji: "☠️", desc: "+ battle win chance from Poison-types" },
        intimidate: { name: "Intimidate", emoji: "😤", desc: "+ battle win chance from Intimidate" },
        cut: { name: "Cut", emoji: "🌿", desc: "+ food foraged while traveling" },
        fly: { name: "Fly", emoji: "🦅", desc: "+ bonus travel distance" },
        surf: { name: "Surf", emoji: "🌊", desc: "+ speed crossing water routes" },
        strength: { name: "Strength", emoji: "💪", desc: "+ injury resistance on grueling pace" },
        flash: { name: "Flash", emoji: "⚡", desc: "+ chance to find hidden stashes" },
        guard: { name: "Guard", emoji: "🛡️", desc: "+ chance to block travel injuries" },
        psychic: { name: "Psychic", emoji: "🔮", desc: "+ chance to foresee encounters/events" }
    };

    // Buffable ability pool, in stat-screen display order
    PT.Data.AbilityBuffOrder = ["poison", "intimidate", "cut", "fly", "surf", "strength", "flash", "guard", "psychic"];
})();
