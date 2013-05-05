/**
 * Utils that should be succinct and may be used often
 */
var Sk = {
    assert : function(condition, message) {
        if(TypeUtil.isEmpty(condition) || !condition) {
            throw message;
        }
    }
}

var StringUtil = {
    paren : function(str) {
        return "( " + str + " )";
    }
}

var TypeUtil = {
    isDefined : function(value) {
        return typeof value != 'undefined';
    },

    hasProp : function(value, prop) {
        return this.isDefined(value[prop]);
    },

    isEmpty : function(value) {
        return !this.isDefined(value) || value == null;
    },

    make2DArray : function(rows, columns, defaultValue) {
        var arr = Array(rows);
        for(var i = 0; i < rows.length; i++) {
            arr[i] = Array(columns);
            for(var j = 0; j < columns.length; j++) {
                arr[i][j] = defaultValue;
            }
        }

        return arr;
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

    /**
     * Util to determine which entities are within range of a given tower.
     *
     * @param type      The type being detected
     * @param tower     The tower entity
     * @returns {Array} The array of entities within range of the tower
     */
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

