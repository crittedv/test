
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
};

var MathUtil = {
    rollVariation : function(value, variance) {
        return value + value * (variance * value * Math.random());
    },

    rollAgainstChance : function(chance) {
        return Math.random() <= chance;
    }
};

var CombatUtil = {

    computeDamage : function(attack, defense) {

    },

    getEntitiesInRange: function(type,tower) {

        var arrTestEntities = [];
        var arrEntitiesInRange = [];

        arrTestEntities = ig.game.getEntitiesByType(type);

        if(arrTestEntities.length != 0){
            for(var i=0;i<arrTestEntities.length;i++){
                var testObject = arrTestEntities[i];
                if(testObject != undefined && testObject != null){
                    if(tower.distanceTo(testObject) <= tower.range){
                        arrEntitiesInRange.push(testObject);
                    }
                }
            }
        }
        return arrEntitiesInRange;
    }
};

