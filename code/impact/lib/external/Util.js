
var TypeUtil = {
    isDefined : function(value) {
        return typeof value != 'undefined';
    },

    hasProp : function(value, prop) {
        return this.isDefined(value[prop]);
    },

    isEmpty : function(value) {
        return !this.isDefined(value) || value == null;
    }
}

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

