ig.module(
    'game.entities.Enemy'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityEnemy = ig.Entity.extend({

        coord      : null,

        zIndex: 10,
        size: {x:32, y:32},

        defense: null,
        bounceSign : -1,
        name: null,

        type: ig.Entity.TYPE.B,
        visitedWaypoints : {},

        animSheet : new ig.AnimationSheet( 'media/tmp/devonHeads.png', 40, 40 ),

        visitWaypoint : function(waypoint) {
            if(!TypeUtil.hasProp(this.visitedWaypoints, waypoint.name)) {
                console.log("Enemy visited waypoint: " + waypoint.name);
                this.vel.y = (this.bounceSign*10);
                this.bounceSign *= -1;
                this.currentAnim = this.anims.moving;
                this.visitedWaypoints[waypoint.name] = waypoint;
            }
        },

        init: function( x, y, settings ) {
            this.parent( x,y, settings );
            this.vel.y = 10;
            this.defense = settings.defense;
            this.addAnim( 'idle', 0.1, [0,1,2,1,0] );
            this.addAnim( 'moving', 0.1, [0,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1]);
        },

        update: function() {
            this.parent();
        }
    });

});
