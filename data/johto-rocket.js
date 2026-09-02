// Porygon Trail - Johto Team Rocket Encounter Pool
//
// Johto's Team Rocket resurgence (Slowpoke Well, the Mahogany Town hideout,
// Lake of Rage, straggler grunts on Route 44/Ice Path, ...) previously drew
// from the exact same Kanto-only Gen I roster as engine/event-engine.js's
// EVENT_BATTLE_OPPONENTS.rocket_grunt pool — a minor story disconnect, since
// this crew never encountered any of those Pokemon. This is a separate,
// Johto-appropriate roster instead. Split into a kept-in-a-separate-file
// tiered pool (matching rocket_grunt's early/mid/late shape) rather than
// folded into events.js, to keep events.js from growing further and to
// mirror the "big static content gets its own data/ file" convention (see
// CLAUDE.md).
//
// Consumed by engine/event-engine.js's pickEventBattleOpponent() when a
// choice's eventBattle.pool is "johto_rocket_grunt" (see data/events.js).
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    PT.Data.JohtoRocketPool = {
        early: [
            { id: 198, name: "Murkrow" },
            { id: 53, name: "Persian" },
            { id: 110, name: "Weezing" },
            { id: 202, name: "Wobbuffet" },
        ],
        mid: [
            { id: 71, name: "Victreebel" },
            { id: 53, name: "Persian" },
            { id: 169, name: "Crobat" },
            { id: 197, name: "Umbreon" },
        ],
        late: [
            { id: 229, name: "Houndoom" },
            { id: 248, name: "Tyranitar" },
            { id: 169, name: "Crobat" },
            { id: 217, name: "Ursaring" },
            { id: 197, name: "Umbreon" },
        ]
    };
})();
