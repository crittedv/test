ig.module(
    'game.entities.Enemy'
)
.requires(
)
.defines(function(){

    EntityEnemy = ig.Entity.extend({

        coord      : null,

        zIndex: 10,
        size: {x:32, y:32},

        defense: null,

       // animSheet : new ig.AnimationSheet( 'media/blocks/undefined.png', 32, 32 ),

        init: function( x, y, settings ) {
            this.defense = settings.defense;
        },

        update: function() {
            this.parent();
        }
    });

});