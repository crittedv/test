/**
 * DefensePrototype is an arch-type factory for Defense objects (specific instances of an entity using it's armor/
 * speed to defend against attacks).  Defense rating is used when calculating the damage of an attack.
 *
 */
ig.module(
    'game.domain.combat.Defense'
)
.requires(
)
.defines(function(){

    Defense = ig.Class.extend({

        rating : 0,

        proto : null,

        isDodge : false,
        dodgeRating : 0,

        /**
         *
         * @param rating
         * @param proto
         * @param dodgeRating
         */
        init: function( rating, proto, dodgeRating ) {
            this.rating = rating;
            this.proto  = defensePrototype;

            if(dodgeRating > 0) {
                this.isDodge  = true;
            }
        }
    });

});
