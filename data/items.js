// Porygon Trail - Item Data
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    PT.Data.Items = {
        food: { name: "Food Rations", price: 100, desc: "Keeps your team fed. Consume per day based on party size.", icon: "F" },
        pokeballs: { name: "Poke Ball", price: 200, desc: "Basic ball. Catch rate: 40%", icon: "o" },
        greatballs: { name: "Great Ball", price: 600, desc: "Better ball. Catch rate: 60%", icon: "O" },
        ultraballs: { name: "Ultra Ball", price: 1200, desc: "Best ball. Catch rate: 80%", icon: "@" },
        potions: { name: "Potion", price: 300, desc: "Restore 1 HP to a Pokemon.", icon: "+" },
        superPotions: { name: "Super Potion", price: 500, desc: "Restore 2 HP to a Pokemon.", icon: "++" },
        repels: { name: "Repel", price: 350, desc: "Avoid the next 3 encounters.", icon: "R" },
        rareCandy: { name: "Rare Candy", price: 2000, desc: "Level up a Pokemon, boosting effectiveness.", icon: "*" },
        escapeRope: { name: "Escape Rope", price: 550, desc: "Escape from dangerous events.", icon: "~" }
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
