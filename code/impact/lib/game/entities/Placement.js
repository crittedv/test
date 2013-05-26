
ig.module(
    'game.entities.Placement'
)
.requires(
    'impact.entity'
)
.defines(function () {

    EntityPlacement = ig.Entity.extend({

        visible : false,
        collisionInfo : null,
        canplace : false,
        checkAgainst: ig.Entity.TYPE.B,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.collisionInfo = settings.collisionInfo;
        },

        /**
         *  Handles user input for tower placement.
         */
        update : function() {

            if(ig.input.pressed("leftButton")){
                if(!this.isBlocked()){
                    ig.game.spawnEntity( EntityTower,this.pos.x, this.pos.y );
                }
            }


            this.parent();
        },

        draw : function() {

            if( this.visible && this.collisionInfo != 0) {
                var context = ig.system.context;
                if(this.isBlocked()) {
                    context.fillStyle = "yellow";
                } else {
                    context.fillStyle = "blue";
                }

                context.fillRect(this.pos.x, this.pos.y, this.collisionInfo.requiredSize.x, this.collisionInfo.requiredSize.y);

                /*
                context.moveTo(this.pos.x, this.pos.y);
                context.lineTo(this.target.x,this.target.y);
                context.stroke();*/
            }
        },

        /**
         * This tests to see if placement of a tower is blocked by anything (wall/enemy/tower).
         *
         * @returns {*|boolean|*|Function}
         */
        isBlocked : function() {
            var closestEnemy = CombatUtil.getClosestEntity(EntityEnemy, this);
            var closestTower = CombatUtil.getClosestEntity(EntityTower, this);
            return((this.touches(closestEnemy) || this.touches(closestTower) || !this.collisionInfo.clear || this.collisionInfo.off));
        }
    });

});
