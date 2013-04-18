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
            /*for(var i = 0; i < info.width; i++) {
                for(var j = 1; j < info.height; j++) {
                    if(info.tiles[i][j] != 0) {
                        info.clear = false;
                        return info;
                    }
                }
            } */
            info.clear = true;
            return info;
        }

    });

});