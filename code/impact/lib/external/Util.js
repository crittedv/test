
var MathUtil = {
    rollVariation : function(value, variance) {
        return value + value * (variance * value * Math.random());
    },

    rollAgainstChance : function(chance) {
        return Math.random() <= chance;
    }
}

var CombatUtil = {

    computeDamage : function(attack, defense) {

    }
}

