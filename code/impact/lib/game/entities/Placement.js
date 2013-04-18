
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

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.collisionInfo = settings.collisionInfo;
        },

        draw : function() {

            if( this.visible && this.collisionInfo != 0) {
                var context = ig.system.context;
                if(!this.collisionInfo.clear || this.collisionInfo.off) {
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
        }
    });

});