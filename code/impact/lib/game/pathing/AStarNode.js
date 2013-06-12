
ig.module(
    'game.pathing.Node'
)
.requires(
)
.defines(function () {

    Node = ig.Class.extend({
        //X-Coordinate within grid
        x : null,

        //Y-Coordinate within grid
        y : null,

        //Grid to which this node belongs
        grid : null,

        //Terrain type of the node
        terrain : null,

        closed : false,
        open   : false,
        cameFrom  : null,
        clearance : 0,
        g  : 0,
        f  : 0,

        init: function (x, y, grid, terrain) {
            this.x = x;
            this.y = y;
            this.grid = grid
            this.terrain = terrain;
            this.id = id(x, y);
        }
    });

});