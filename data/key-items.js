// Porygon Trail - Key Items (gym reward buffs)
// Stackable: picking the same key item again adds another stack of its bonus.
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    PT.Data.KeyItems = {
        amuletCoin: {
            id: "amuletCoin",
            name: "Amulet Coin",
            icon: "assets/key-items/amulet-coin.png",
            desc: "A charm coin that draws prize money toward its holder.",
            stat: "money",
            amount: 4,
            buffLabel: "+4% Money Earned"
        },
        sootheBell: {
            id: "sootheBell",
            name: "Soothe Bell",
            icon: "assets/key-items/soothe-bell.png",
            desc: "Its gentle chime calms wild Pokemon, making them easier to catch.",
            stat: "catch",
            amount: 4,
            buffLabel: "+4% Catch Rate"
        },
        muscleBand: {
            id: "muscleBand",
            name: "Muscle Band",
            icon: "assets/key-items/muscle-band.png",
            desc: "A worn wristband that sharpens battle instincts.",
            stat: "win",
            amount: 2,
            buffLabel: "+2% Win Rate"
        }
    };

    // Display/offer order on the gym reward screen
    PT.Data.KeyItemOrder = ["amuletCoin", "sootheBell", "muscleBand"];
})();
