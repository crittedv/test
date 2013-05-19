ig.module(
    'plugins.RichCollisionMap'
)
.requires(
    'impact.entity'
).
defines(function() {

    ig.CollisionMap.inject({

        //TODO: Perhaps do this in a pass in Map
        getCollisionInfo : function (topLeft, dimensions) {
            var info = this.getTiles(topLeft, dimensions);
            for(var i = 0; i < info.height; i++) {
                for(var j = 0; j < info.width; j++) {
                    if(info.tiles[i][j] != 0) {
                        info.clear = false;
                        return info;
                    }
                }
            }
            info.clear = true;
            return info;
        },

        widthInPixels : function() {
            return this.width * this.tilesize;
        },

        heightInPixels : function() {
            return this.height * this.tilesize;
        }

    });

});