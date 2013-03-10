/**
 * DefensePrototype is an arch-type factory for Defense objects (specific instances of an entity using it's armor/
 * speed to defend against attacks).  Defense rating is used when calculating the damage of an attack.
 *
 */
ig.module(
    'game.domain.combat.DefensePrototype'
)
.requires(
)
.defines(function(){

    DefensePrototype = ig.Class.extend({

        /**
         * The chance that an enemy will dodge an attack rather than absorb
         * it through his armor.
         */
        dodgeChance : 0,

        /**
         * How much the effectiveness of a dodge is affected by luck
         */
        dodgeVariance : 0,

        /**
         * Amount of damage that can be evaded via dodge (put a really large
         * number (MAX_INT) for complete evasion).
         */
        dodgeEffectiveness : 0,

        /**
         * A number between 0-1 that is a percentage of how much an
         * armors protection might be influenced by luck (i.e. how much
         * it might vary).
         */
        bonusVariance : 0,

        /**
         * The base amount of damage this armor will subtract from incoming
         * damage (ignoring differences in armorType/attackType).
         */
        rating : 0,

        /**
         * Describes the type of armor of this prototype.  This must be a member
         * of the ARMOR_TYPE enum.  Depending on the attack type of the attack
         * and damage type of the armor an attack might deal more or less damage than usual.
         * TODO: Do we want damageType?
         */
        armorType : null,

        /**
         *
         * @param armorType A member of the ARMOR_TYPE enum
         * @param rating The base amount of protection this armor will provide
         * @param bonusVariance The amount of variability the protection this armor provides
         */
        init: function( armorType, rating, bonusVariance ) {
            this.armorType     = armorType;
            this.rating        = rating;
            this.bonusVariance = bonusVariance
        },

        /**
         * Create a Defense object using this object as a prototype.  The
         * @return Defense object describing this defense.
         */
        rollDefense : function() {
            var dodgeRating = 0;
            if(MathUtil.rollAgainstChance(this.dodgeChance)) {
                dodgeRating = MathUtil.rollVariation(this.dodgeEffectiveness, this.dodgeVariance);
            }

            var rating = Math.rollVariation(this.rating, this.bonusVariance);
            return new Defense(rating, this, dodgeRating);
        }

    });

});
