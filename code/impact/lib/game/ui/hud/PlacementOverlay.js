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
                var loc = {x : ig.input.mouse.x, y : ig.input.mouse.y};
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

        updatePlacement : function() {
            var loc = {x : ig.input.mouse.x, y : ig.input.mouse.y};
            var collisionInfo = ig.game.collisionMap.getCollisionInfo( loc, this.dimensions );
            this.placement.pos = loc;
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