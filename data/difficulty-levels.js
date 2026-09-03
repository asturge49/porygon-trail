// Porygon Trail - Difficulty Levels
// New-game difficulty selector (§ difficulty-levels). state.difficultyLevel
// (integer 1-5, set in engine/game-state.js's createNewGame, default 1) picks
// one of these configs. PT.Data.getLevelConfig(state) is the one place every
// other file should read a level's config through — never index
// PT.Data.DifficultyLevels directly, so an out-of-range/unset difficultyLevel
// always resolves safely to level 1's config.
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    // Indexed 1-5 (index 0 unused) so `DifficultyLevels[state.difficultyLevel]`
    // reads naturally wherever a level number is already in hand.
    PT.Data.DifficultyLevels = [
        null,
        {
            level: 1,
            name: 'Casual',
            scoreMultiplier: 1.0,
            trainersEnabled: false,
            gymGauntlet: false,
            aceTrainers: false,
            routeDistanceBonus: 0,
            shopPriceMultiplier: 1.0
        },
        {
            level: 2,
            name: 'Trainer',
            scoreMultiplier: 1.5,
            trainersEnabled: true,
            gymGauntlet: false,
            aceTrainers: false,
            routeDistanceBonus: 0,
            shopPriceMultiplier: 1.0
        },
        {
            level: 3,
            name: 'Veteran',
            scoreMultiplier: 2.0,
            trainersEnabled: true,
            gymGauntlet: true,
            aceTrainers: false,
            routeDistanceBonus: 15,
            shopPriceMultiplier: 1.0
        },
        {
            level: 4,
            name: 'Expert',
            scoreMultiplier: 2.5,
            trainersEnabled: true,
            gymGauntlet: true,
            aceTrainers: true,
            routeDistanceBonus: 15,
            shopPriceMultiplier: 1.0
        },
        {
            level: 5,
            name: 'Master',
            scoreMultiplier: 3.0,
            trainersEnabled: true,
            gymGauntlet: true,
            aceTrainers: true,
            routeDistanceBonus: 30,
            shopPriceMultiplier: 1.15
        }
    ];

    // Safe accessor — always returns a valid config, defaulting to level 1
    // (Casual) when state.difficultyLevel is unset, out of range, or the
    // state object itself is missing.
    PT.Data.getLevelConfig = function(state) {
        const level = state && state.difficultyLevel;
        const config = PT.Data.DifficultyLevels[level];
        return config || PT.Data.DifficultyLevels[1];
    };
})();
