
function id(x, y) {
    return x + "_" + y;
}

//TODO: Make a better enum
var Terrain = {
   "Land"  : 1,
   "Water" : 2,
   "Rock"  : 4,

    1 : "Land",
    2 : "Water",
    4 : "Rock"
};

function TerrainFlag() {
    this.flag = arguments[0];
    for(var i = 1; i < arguments.length; i++) {
        this.flag |= arguments[i];
    }
}

TerrainFlag.prototype = {
    hasTerrain : function(terrain) {
        return (this.flag & terrain) >= 1;
    }
}

//Constraints used to build a map
function TerrainConstraints(terrain, perc, cohesion, cohesionStep, minAdjacent, maxAdjacent) {

    //The type of terrain laid down by this object
    this.terrain = terrain;

    //The percentage of this type of tile that should be on the board
    this.perc = perc;

    //The base chance that after placing 1 of this type we will place another
    this.cohesion = cohesion;

    //Every time a tile of this type is added, how much we should subtract from the
    //current cohesion chance.  This only starts being deducted AFTER minAdjacent has
    //been met
    this.cohesionStep = cohesionStep;

    //When placing this tile type, what is the minimum number of additional tiles
    //of this type that should be placed together
    this.minAdjacent = minAdjacent;

    //When placing this tile type, what is the maximum number of additional tiles
    //that should be placed together
    this.maxAdjacent = maxAdjacent;
}

TerrainConstraints.prototype = {
    populateGrid : function(grid) {
        var tilesLeftToPlace = grid.width * grid.height * this.perc;
        while( tilesLeftToPlace > 0 ) {
            tilesLeftToPlace -= this._placeTiles( grid.chooseNotOf(this.terrain), grid );
        }
    },

    _placeTiles : function ( node, grid ) {
        node.terrain = this.terrain;
        return 1;
    }
}

function Node(x, y, terrain, grid) {
    this.x = x;
    this.y = y;
    this.grid = grid
    this.terrain = terrain;
    this.id = id(x, y);
    this.closed = false;
    this.open   = false;
    this.g = 0;
    this.f = 0;
    this.cameFrom = null;
    this.clearance = 0;
}

Node.prototype = {
    hashCode : function() {
        return this.x * this.y * this.grid.hashCode();
    }
}

function Grid(terrainFlag, width, height, defaultTerrain, terrainConstraints) {
    this.terrainFlag = terrainFlag;
    this.width  = width;
    this.height = height;
    this.data = [[]];

    for(var i = 0; i < height; i++) {
        this.data[i] = [];
        for(var j = 0; j < width; j++) {
            this.data[i][j] = new Node(j, i, defaultTerrain);
        }
    }

    for( var i = 0; i < terrainConstraints.length; i++ ) {
        terrainConstraints[i].populateGrid( this );
    }
}

/** Each grid finds pathing for a set of terrain flags */
Grid.prototype = {

    chooseAny : function() {
        var x = Math.floor(Math.random() * this.width);
        var y = Math.floor(Math.random() * this.height);

        return this.data[y][x];
    },

    chooseOf : function(terrain) {
        var node = this.chooseAny();
        while(node.terrain != terrain) {
            node = this.chooseAny();
        }
        return node;
    },

    chooseNotOf : function(terrain) {
        var node = this.chooseAny();
        while(node.terrain == terrain) {
            node = this.chooseAny();
        }
        return node;
    },

    clear : function() {
        for(var i = 0; i < this.height; i++ ) {
            for(var j = 0; j < this.width; j++ ) {
                var node = this.data[i][j];
                node.closed = false;
                node.open   = false;
                node.g = 0;
                node.f = 0;
                node.cameFrom = null;
                node.clearance = 0;
            }
        }
    },

    //To understand what happens in filter diagonal, draw a grid and add a unit of arbitrary clearance
    //When you select a given diagonal, because we know the space we already occupy is open, there exists
    //a grid node whose clearance must be requiredClearance + 1 in order to move into that diagonal or
    //we will a corner
    filterDiagonals : function(node, neighbor, requiredClearance ) {

        //The location that must have requiredClearance + 1 to ensure moveability
        var required = null;
        if(neighbor.x == node.x - 1) {
            if(neighbor.y == node.y - 1) { //Moving to the upper left
               required = neighbor;
            } else if( neighbor.y == node.y+1 ) { //Moving to the bottom left
               required = this.data[node.y][node.x-1];
            }
        } else if(neighbor.x == node.x + 1 ) {
            if(neighbor.y == node.y - 1) { //Moving to the upper right
                required = this.data[node.y-1][node.x];
            } else if( neighbor.y == node.y+1 ) { //moving to the lower right
                required = node;
            }
        }

        return required == null || required.clearance >= (requiredClearance + 1);
    },

    //TODO: Need to handle arbitrary diagonals
    //TODO: Need to speed this up
    findNeighbors : function(node, neighbors, requiredClearance) {
        //for hopping units
        var reach = 1;

        var left  = Math.max(0, node.x - reach);
        var right = Math.min(this.width-1, node.x + reach);

        var top    = Math.max(0, node.y - reach);
        var bottom = Math.min(this.height-1, node.y + reach);

        var cur;
        for(var i = top; i <= bottom; i++) {
            for(var j = left; j <= right; j++) {
                cur = this.data[i][j];
                if( cur != node && cur.clearance >= requiredClearance && this.terrainFlag.hasTerrain(cur.terrain) &&
                    this.filterDiagonals(node, cur, requiredClearance) ) {
                    neighbors.push(cur);
                }
            }
        }

        return neighbors;
    },

    //Uses hierarchical A* article's notion of clearance but uses previously computed
    //values to continue to compute clearance
    computeClearance : function( ) {
        var data        = this.data;
        var terrainFlag = this.terrainFlag;

        for( var j = 0; j < this.height; j++ ) {
            for(var i = 0; i < this.width; i++) {
                var currentNode = data[j][i];
                if( !terrainFlag.hasTerrain( currentNode.terrain ) )  {
                    currentNode.clearance = 0;
                    continue;
                }

                var prevHorizontal    = ( i == 0 ) ? 0 : data[j][i-1].clearance;
                var prevVertical      = ( j == 0 ) ? 0 : data[j-1][i].clearance;

                var clear = true;

                //if both == 0, can't use any previously calculated values
                if( prevHorizontal < 3 && prevVertical < 3 ) {
                    currentNode.clearance = 1;

                    //use the one that excludes a greater number of cells from being checked
                } else if ( prevHorizontal > prevVertical ) {
                    currentNode.clearance = prevHorizontal - 1;
                    //check the column that is not guaranteed to be clear due to previous calculation
                    var i2 = i + currentNode.clearance;
                    var jMax = j + prevHorizontal;

                    if( i2 < this.width && jMax < this.height ) {
                        for(var j2 = j; j2 < jMax && clear; j2++) {
                            if( !terrainFlag.hasTerrain( data[j2][i2].terrain) ) {
                                clear = false;
                            }
                        }

                        if( clear ) {
                            currentNode.clearance += 1;
                        }
                    } else {
                        clear = true;
                    }

                } else {
                    currentNode.clearance = prevVertical - 1;
                    //check the row that is not guaranteed to be clear due to previous calculation
                    var j2 = j + currentNode.clearance;
                    var iMax = i + prevVertical;

                    if( iMax < this.width && j2 < this.height ) {
                        for(var i2 = i; i2 < iMax && clear; i2++) {
                            if( !terrainFlag.hasTerrain( data[j2][i2].terrain ) ) {
                                clear = false;
                            }
                        }

                        if( clear ) {
                            currentNode.clearance += 1;
                        }
                    } else {
                        clear = false;
                    }
                }

                while(clear) {
                    var j2 = j + currentNode.clearance;
                    var i2 = i + currentNode.clearance;

                    if( i2 < this.width && j2 < this.height ) {
                        for(var z = 0; z < currentNode.clearance && i+z < this.width; z++ ) {
                            if( !terrainFlag.hasTerrain( data[j2][i+z].terrain ) ) {
                                clear = false;
                            }
                        }

                        for(var z = 0; z < currentNode.clearance && j+z < this.height; z++ ) {
                            if( !terrainFlag.hasTerrain( data[j+z][i2].terrain ) ) {
                                clear = false;
                            }
                        }

                        clear = clear && terrainFlag.hasTerrain( data[j2][i2].terrain );
                        if( clear ) {
                            currentNode.clearance += 1;
                        }
                    } else {
                        clear = false;
                    }
                }
            }
        }
    },

    //Favors diagonals
    distance : function(node1, node2) {
        var xDistance = Math.abs(node1.x - node2.x);
        var yDistance = Math.abs(node1.y - node2.y);

        var h;
        if( xDistance > yDistance ) {
            h = 14*yDistance + 10*(xDistance-yDistance);
        } else {
            h = 14*xDistance + 10*(yDistance-xDistance)
        }

        return h;
    },


    /**
     * Navigation is done from the top-left square of the enitity for which
     * we are finding a path.
     * @param requiredClearance
     * @param current
     * @param end
     *
     * Note as far as the found method is concerned the angle that our
     * searcher faces never changes but you could use the current.cameFrom
     * to angle its icon
     *
     *
     */
    found : function( requiredClearance, current, end ) {
        var maxY = Math.min(current.y + requiredClearance, this.height - 1);
        var maxX = Math.min(current.x + requiredClearance, this.width  - 1);

        for( var i = current.x; i < maxX; i++ ) {
            for( var j = current.y; j < maxY; j++) {
                if( this.data[j][i] == end ) {
                    return true;
                }
            }
        }

        return false;
    },

    constructReversedPath : function(current) {
        var path = [ current ];
        while(current.cameFrom != null) {
            path[path.length] = current;
            current = current.cameFrom;
        }

        return path;
    },

    findPath : function(start, end, requiredClearance) {
        var openSet   = new BinaryHeap(function(n){ return n.f; });
        //At the moment, since we only ever test the inclusion of a node in closedSet (rather than
        //iterating over closed set, we can omit it and just keep a closed field on the node)
        //cameFrom is also a field on the node rather than a map

        openSet.push(start);

        start.g = 0;
        start.f = start.g + this.distance(start, end);


        var path = null;

        while( openSet.size() > 0 && path ==  null ) {
            var current = openSet.pop();

            if( this.found( requiredClearance, current, end) ) {
                path = this.constructReversedPath(current).reverse();
            }

            current.open = false;
            current.closed = true;

            var neighbors = this.findNeighbors( current, [], requiredClearance );
            for( var i = 0; i < neighbors.length; i++ ) {
                var neighbor = neighbors[i];
                var tentativeG = current.g + this.distance( current ,neighbor );
                if( neighbor.closed && tentativeG >= neighbor.g ) {
                    continue;
                }

                if( !neighbor.open || tentativeG < neighbor.g ) {
                    neighbor.g = tentativeG;
                    neighbor.cameFrom = current;
                    neighbor.f = neighbor.g + this.distance(neighbor, end);

                    if( !neighbor.open ) {
                        neighbor.open = true;
                        openSet.push(neighbor);
                    }
                }
            }
        }

        return path;
    },

    hashCode : function() {
        return this.id * this.width * this.height * this.terrainFlag;
    }

}