/**
 * Armor is an arch-type factory for Defense objects (specific instances of an entity using it's armor/
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
         * @param armor
         * @param dodgeRating
         */
        init: function( rating, armor, dodgeRating ) {
            this.rating = rating;
            this.proto  = armor;

            if(dodgeRating > 0) {
                this.isDodge  = true;
            }
        }
    });

});
