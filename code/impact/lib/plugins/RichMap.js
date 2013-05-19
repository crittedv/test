
ig.module(
    'plugins.RichMap'
)
.requires(
    'impact.map'
).
defines(function() {

    ig.Map.inject({

        getTileIndices : function (pos) {
            var xIndex = Math.floor( pos.x / this.tilesize );
            var yIndex = Math.floor( pos.y / this.tilesize );
            if(
                (xIndex >= 0 && xIndex <  this.width) &&
                    (yIndex >= 0 && yIndex < this.height)
                ) {
                return {x : xIndex, y : yIndex};
            }
            else {
                return 0;
            }
        },

        getTiles : function(topLeftPos, dimension) {
            var topLeftIndices = this.getTileIndices(topLeftPos);
            if(topLeftIndices == 0) {
                return 0;
            }

            var numCols = this._calculateTiles(this.width,  topLeftIndices.x,  dimension.x);
            var numRows = this._calculateTiles(this.height, topLeftIndices.y,  dimension.y);

            var tiles = [[]];
            for(var i = 0; i < numCols.actualTiles; i++) {
                tiles[i] = Array(numRows.actualTiles);
                for(var j = 0; j < numRows.actualTiles; j++) {
                    tiles[i][j] = this.data[topLeftIndices.y + i][topLeftIndices.x + j];
                }
            }

            var tilesize = this.tilesize;

            return {
               topLeft      : {x: topLeftIndices.x * tilesize, y: topLeftIndices.y * tilesize},
               requiredSize : dimension,

               xOff : numCols.off,
               yOff : numRows.off,
               off :  numCols.off || numRows.off,
               tilesize : tilesize,

               requiredWidth  : numCols.expectedTiles,
               requiredHeight : numRows.expectedTiles,
               width  : numCols.actualTiles,
               height : numRows.actualTiles,

               tiles : tiles
            };
        },

        _calculateTiles : function(totalTiles, startTile, dimension) {
            var expectedTiles = Math.ceil(dimension / this.tilesize);
            var actualTiles   = Math.min(expectedTiles, totalTiles - startTile);

            return {
                expectedTiles : expectedTiles,
                actualTiles   : actualTiles,
                off : expectedTiles != actualTiles
            };
        }

    });

});