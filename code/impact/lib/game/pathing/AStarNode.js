
ig.module(
    'game.pathing.AStarNode'
)
.requires(
)
.defines(function () {

    AStarNode = ig.Class.extend({
        //X-Coordinate within grid
        x : null,

        //Y-Coordinate within grid
        y : null,

        //Grid to which this node belongs
        grid : null,

        //Terrain type of the node
        terrain : null,

        //Is this on the closed list for the current/previous run of the
        //AStarGrid that contains this node
        closed : false,

        //Is this on the open list for the current/previous run of the
        //AStarGrid that contains this node
        open   : false,

        //The path back to the start given the current start and end of
        //a given grid
        cameFrom  : null,

        //The distance between this node and an impassable node given
        //the terrain type of the grid in question
        clearance : 0,
        g  : 0,
        f  : 0,

        init: function (x, y, grid, terrain) {
            this.x = x;
            this.y = y;
            this.grid = grid
            this.terrain = terrain;
        }
    });

});