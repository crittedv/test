ig.module(
    'game.ui.hud.PlacementOverlay'
)
.requires(
)
.defines(function () {

    PlacementOverlay = ig.Class.extend({

        name       : null,
        dimensions : null,
        placement  : null,
        visible    : false,

        init: function (name, dimensions) {
            this.name       = name;
            this.dimensions = dimensions;
        },

        show : function() {
            if(this.placement == null) {
                var loc = this.getLocFromMouse();
                var collisionInfo = ig.game.collisionMap.getCollisionInfo( loc, this.dimensions );
                var tl = collisionInfo.topLeft;

                var entityName = this.name;
                this.placement = ig.game.spawnEntity(EntityPlacement, tl.x, tl.y, {
                    collisionInfo : collisionInfo,
                    name : entityName
                });
            }
            this.placement.visible = true;
        },

        hide : function() {
            if( this.placement != null ) {
                this.placement.visible = false;
            }
        },

        getLocFromMouse : function() {
            var collisionMap = ig.game.collisionMap;

            //TODO: Figure out why the -8 (i.e. 1/2 the CollisionMap grid size) get's
            //TODO: A better result here
            var x = ig.input.mouse.x - Math.min(this.dimensions.x / 2 - 8);
            var y = ig.input.mouse.y - Math.min(this.dimensions.y / 2 - 8);

            x = MathUtil.bound(x, 0, collisionMap.widthInPixels());
            y = MathUtil.bound(y, 0, collisionMap.heightInPixels() - this.dimensions.y);

            return {  x : x, y :y  };
        },

        updatePlacement : function() {
            var loc = this.getLocFromMouse();
            var collisionInfo = ig.game.collisionMap.getCollisionInfo( loc, this.dimensions );
            this.placement.pos = collisionInfo.topLeft;
            this.placement.collisionInfo = collisionInfo;
        },

        update : function() {
            if( this.placement.visible ) {
                this.updatePlacement();
            }
        },

        hasCollision : function() {
            return this.placement.collisionInfo.clear && !this.placement.collisionInfo.off;
        }
    });

});