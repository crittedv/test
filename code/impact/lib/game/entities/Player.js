ig.module(
    'game.entities.Player'
)
.requires(
    'impact.entity',
    'game.ui.decorations.BarMeter'
)
.defines(function(){

    EntityPlayer = ig.Entity.extend({

        name: null,
        maxHealth : 0,
        health    : 0,
        healthMeterUi : null,
      //  healthMeterYOffset : -1,

        type: ig.Entity.TYPE.NONE,
        animSheet: new ig.AnimationSheet('media/player.png', 64,64),


        getHealth : function() {
            return this.health;
        },

        getPercHealth : function() {
            return this.health / this.maxHealth;
        },

        isDead : function() {
           // console.log("creep health: " + this.name);
            if(this.getHealth() <= 0){
                return true;
            }
            else{
                return false;
            }
        },

        visitExit : function(exit) {
            this.kill();
        },


        init: function( x, y, settings ) {
            this.parent( x,y, settings );
            this.health    = 10;
            this.maxHealth = 100;

            this.addAnim('idle', 1, [0]);
            this.pos.x = x;
            this.pos.y = y;

        },

        update: function() {

            if(this.isDead()) {
                this.kill();
            }

            this.parent();
        }



    });

});
