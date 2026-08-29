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
        },
        hpUp: {
            id: "hpUp",
            name: "HP Up",
            icon: "assets/key-items/hp-up.png",
            desc: "A vitamin that permanently raises a chosen Pokemon's HP. Survives evolution.",
            stat: "hp",
            amount: 1,
            buffLabel: "+1 Max HP (choose a Pokemon)",
            targeted: true,
            maxStacksPerTarget: 3
        },
        whiteFlute: {
            id: "whiteFlute",
            name: "White Flute",
            icon: "assets/key-items/white-flute.png",
            desc: "Its high pitch stirs up wild Pokemon activity along the route.",
            stat: "event",
            amount: 10,
            buffLabel: "+10% Event Rate",
            maxStacks: 7
        }
    };

    // Fixed relative order used whenever items are displayed. Each gym
    // reward only offers 3 of these 5, sampled at random.
    PT.Data.KeyItemOrder = ["amuletCoin", "sootheBell", "muscleBand", "hpUp", "whiteFlute"];
})();
