// Porygon Trail - Item Data
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    // `johtoMultiplier` (optional) scales an item's base price while
    // state.region === 'johto' — see getItemPrice below. Only items that
    // matter for day-to-day survival (balls/potions/repels) get one; food,
    // Rare Candy, and Escape Rope stay at their Kanto price so the tighter
    // Johto economy is felt at the register without penalizing every
    // resource across the board (§12 — money scarcity in Johto).
    PT.Data.Items = {
        food: { name: "Food Rations", price: 200, desc: "Keeps your team fed. Consume per day based on party size.", icon: "F" },
        pokeballs: { name: "Poke Ball", price: 200, desc: "Basic ball. Catch rate: 40%", icon: "o", johtoMultiplier: 1.4 },
        greatballs: { name: "Great Ball", price: 600, desc: "Better ball. Catch rate: 60%", icon: "O", johtoMultiplier: 1.4 },
        ultraballs: { name: "Ultra Ball", price: 1200, desc: "Best ball. Catch rate: 80%", icon: "@", johtoMultiplier: 1.4 },
        potions: { name: "Potion", price: 300, desc: "Restore 1 HP to a Pokemon.", icon: "+", johtoMultiplier: 1.35 },
        superPotions: { name: "Super Potion", price: 500, desc: "Restore 2 HP to a Pokemon.", icon: "++", johtoMultiplier: 1.35 },
        repels: { name: "Repel", price: 350, desc: "Avoid the next 3 encounters.", icon: "R", johtoMultiplier: 1.3 },
        rareCandy: { name: "Rare Candy", price: 2000, desc: "Level up a Pokemon, boosting effectiveness.", icon: "*" },
        escapeRope: { name: "Escape Rope", price: 550, desc: "Escape from dangerous events.", icon: "~" }
    };

    // Region-aware effective price for a shop item. Johto scales up the
    // base price for items with a johtoMultiplier (balls/potions/repels —
    // the resources that matter most for day-to-day survival); everything
    // else, and any purchase made while in Kanto, is unaffected. Centralized
    // here so every screen that quotes or charges a price (buy, buy x5,
    // sell, sell x5) stays consistent (§12 — money scarcity in Johto).
    PT.Data.getItemPrice = function(key, state) {
        const item = PT.Data.Items[key];
        if (!item) return 0;
        if (state && state.region === 'johto' && item.johtoMultiplier) {
            return Math.round(item.price * item.johtoMultiplier);
        }
        return item.price;
    };

    // Shop inventory varies by location progression
    PT.Data.ShopInventory = {
        early: ["food", "pokeballs", "potions", "repels"],
        mid: ["food", "pokeballs", "greatballs", "potions", "superPotions", "repels", "escapeRope"],
        late: ["food", "pokeballs", "greatballs", "ultraballs", "potions", "superPotions", "repels", "escapeRope", "rareCandy"]
    };

    PT.Data.getShopTier = function(locationIndex) {
        if (locationIndex <= 2) return "early";
        if (locationIndex <= 8) return "mid";
        return "late";
    };
})();
