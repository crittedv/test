/**
 * AttackPrototype is the arch-type factory of an attack. That is, an attack may have an attack prototype object
 * (perhaps multiple?) that is used to generate an instance of an attack on an enemy.
 */
ig.module(
    'game.domain.combat.AttackPrototype'
)
.requires(
)
.defines(function(){

    Weapon = ig.Class.extend({

        /**
         * A number from 0-1 indicating the chance for a critical strike
         */
        critChance    : 0,

        /**
         * The base amount of extra damage dealt by a critical strike
         */
        critBase     : 0,

        /**
         * A number between 0-1 that indicates how much of a critical
         * strikes extra damage might be influenced by luck
         */
        critVariance : 0,

        /**
         * A number between 0-1 that is a percentage of how much an
         * attacks damage might be influenced by luck (i.e. how much
         * it might vary).
         */
        bonusVariance : 0,

        /**
         * The base amount of damage this attack might do.  The following
         * calculation of the actual damage (without reduction from armor)
         * will be calculated as follows (see AttackUtil.computeDamage):
         * var maxBonus = damage * bonusVariance;
         * var actualDamage = Math.floor(damage * (bonusVariance * random));
         *
         * Currently this means that the max amount of damage that can be done
         * by a single attack is: damage + (damage * bonusVariance) and that
         * there is an equal chance of any amount of damage between:
         * damage to (damage * bonusVariance).
         *
         * In the future we might consider adding probability distributions or
         * "critical chance"
         */
        damage   : 0,

        /**
         * Describes the type of damage for this attack.  This must be a member
         * of the ATTACK_TYPE enum.  Depending on the attack type of the attack
         * and damage type of the armor an attack might deal more or less damage than usual.
         * TODO: Do we want damageType?
         */
        type : null,

        /**
         *
         * @param damage The base damage this attack might do
         * @param attackType Type A member of the ATTACK_TYPE enum
         * @param variance
         * @param critChance
         * @param critBase
         * @param critVariance
         */
        init: function( damage, attackType, variance, critChance, critBase, critVariance ) {
            this.damage = damage;
            this.type   = attackType;
            this.critChance = critChance;
            this.critBase   = critBase;
            this.critVariance = critVariance;
        },


        /**
         * Create an Attack object using this object as a prototype.  The
         * @return Attack object describing this attack.
         */
        rollAttack : function() {
            var critDamage = 0;
            if(MathUtil.rollAgainstChance(this.critChance)) {
                critDamage = MathUtil.rollVariation(this.critBase, this.critVariance);
            }

            var damage = Math.rollVariation(this.damage, this.bonusVariance);
            return new Attack(damage, this, critDamage);
        }
    });

});