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
            amount: 8,
            buffLabel: "+8% Money Earned"
        },
        sootheBell: {
            id: "sootheBell",
            name: "Soothe Bell",
            icon: "assets/key-items/soothe-bell.png",
            desc: "Its gentle chime calms wild Pokemon, making them easier to catch.",
            stat: "catch",
            amount: 8,
            buffLabel: "+8% Catch Rate"
        },
        muscleBand: {
            id: "muscleBand",
            name: "Muscle Band",
            icon: "assets/key-items/muscle-band.png",
            desc: "A worn wristband that sharpens battle instincts.",
            stat: "win",
            amount: 5,
            buffLabel: "+5% Win Rate"
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
        },
        focusBand: {
            id: "focusBand",
            name: "Focus Band",
            icon: "assets/key-items/focus-band.png",
            desc: "A worn headband that lets a Pokemon cling to consciousness through a finishing blow.",
            stat: "deathAvoid",
            amount: 6,
            buffLabel: "+6% Death Avoidance",
            maxStacks: 3
        },
        bicycle: {
            id: "bicycle",
            name: "Bicycle",
            icon: "assets/key-items/bicycle.png",
            desc: "Covers extra ground every day, no matter which Pokemon are in your party.",
            stat: "travel",
            amount: 2,
            buffLabel: "+2 Miles/Day",
            maxStacks: 4
        },
        silphScope: {
            id: "silphScope",
            name: "Silph Scope",
            icon: "assets/key-items/silph-scope.png",
            desc: "Reveals what's really out there — Team Rocket activity and legendary sightings both turn up more often.",
            stat: "eventWeight",
            amount: 50,
            buffLabel: "+50% Rocket/Legendary Odds",
            maxStacks: 3
        },
        expShare: {
            id: "expShare",
            name: "Exp. Share",
            icon: "assets/key-items/exp-share.png",
            desc: "Splits battle experience with the team — one other eligible Pokemon also gets a shot at a Battle Star on every win, or a shot at evolving in place if they're not fully evolved yet. Rare, and you can only carry one.",
            stat: "teamExp",
            buffLabel: "Shares Battle Stars & Evolutions",
            maxStacks: 1,
            pickWeight: 1
        }
    };

    // Fixed relative order used whenever items are displayed. Each gym
    // reward samples 3 of these at random (weighted by pickWeight, default 3).
    PT.Data.KeyItemOrder = ["amuletCoin", "sootheBell", "muscleBand", "hpUp", "whiteFlute", "focusBand", "bicycle", "silphScope", "expShare"];
})();
