/**
 * An actual instance of an attack.
 *
 */
ig.module(
    'game.domain.combat.Attack'
)
.requires(
)
.defines(function(){

    Attack = ig.Class.extend({

        damage   : 0,

        weapon : null,

        isCrit : false,
        critDamage : 0,

        init: function( damage, weapon, critDamage) {
            this.damage   = damage;
            this.weapon   = weapon;
            if(critDamage > 0) {
                this.isCrit     = true;
                this.critDamage = critDamage;
            }
        }
    });

});