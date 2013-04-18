
ig.module(
    'game.util.Grid'
)
.requires(
)
.defines(function () {

    Grid = ig.Class.extend({
        pos  : null,
        size : null,
        blockSize : null,
        blocks    : null,
        numRows   : null,
        numCols   : null,

        init: function (pos, size, blockSize) {
            this.pos       = pos;
            this.size      = size;
            this.blockSize = blockSize;

            var paren = StringUtil.paren;
            Sk.assert(size.x % blockSize.x != 0, "Grid size.x " + paren(this.size.x)+
                "is not a multiple of blockSize.x " + paren( blockSize.x ));

            Sk.assert(size.y % blockSize.y != 0, "Grid size.y (" + this.size.y + ") " +
                "is not a multiple of blockSize.y ( " + blockSize.y + " )");

            this.numRows   = Math.floor(size.x / blockSize.x);
            this.numCols   = Math.floor(size.y / blockSize.y);

            this.blocks    = make2DArray(this.numRows, this.numCols, null);
        },

        /**
         * Private:
         * @param min
         * @param size
         * @param value
         * @returns {boolean}
         */
        withinBound : function(min, size, value) {
            return !(value < min || value > min + size);
        },

        /**
         * Private:
         * @param min
         * @param blockWidth
         * @param value
         */
        toBlockIndex : function(min, blockWidth, value) {
            return Math.floor((value - min) / blockWidth);
        },

        withinBounds : function(pos) {
            return this.withinBound(this.pos.x, this.size.x, pos.x) &&
                   this.withinBound(this.pos.y, this.size.y, pos.y);
        },

        posToBlockCoord : function(pos) {
            var paren = StringUtil.paren;
            Sk.assert(this.withinBound(this.pos.x, this.size.x, pos.x),
                "pos.x " + paren(pos.x) + " is not within the grid's x-bounds " +
                    paren(this.pos.x + ", " + this.pos.x + this.size.x));

            Sk.assert(this.withinBound(this.pos.y, this.size.y, pos.y),
                "pos.x " + paren(pos.y) + " is not within the grid's y-bounds " +
                    paren(this.pos.y + ", " + this.pos.y + this.size.y));

            return {
                x: this.toBlockIndex(this.pos.x, this.blockSize.x, pos.x),
                y: this.toBlockIndex(this.pos.y, this.blockSize.y, pos.y)
            };
        },

        posToBlock : function(pos) {
            var coord = this.posToBlockCoord(pos);
            return this.blocks[coord.x][coord.y];
        }
    });

});