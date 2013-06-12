
function id(x, y) {
    return x + "_" + y;
}

//TODO: Write tests where we compared the "Modified clearance" (i.e. the clearance we
//TODO: we compute when placing/removing a tower vs. that same map with/without the
//TODO: tile using the normal clearance computation)
//TODO: Perhaps decide whether or not to compute per tower or recompute entire clearance
//TODO: Based on the sparsity of the region (which is kept track of)

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
    this.width   = width;
    this.height  = height;
    this.openSet = new BinaryHeap(function(n){ return n.f; });
    this.data = [[]];

    for(var i = 0; i < height; i++) {
        this.data[i] = [];
        for(var j = 0; j < width; j++) {
            this.data[i][j] = new Node(j, i, defaultTerrain, this);
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

    chooseOfWClearance : function(terrain, clearance) {
        var node = this.chooseAny();
        while(node.terrain != terrain || node.clearance >= clearance) {
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
    findNeighbors : function(node, neighbors, requiredClearance, unfiltered) {
        //for hopping units
        if( (typeof unfiltered == "undefined") ) { //TODO: use TypeUtil when in Impact
            unfiltered = false;
        }

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
                    ( unfiltered || this.filterDiagonals(node, cur, requiredClearance) )) {
                    neighbors.push(cur);
                }
            }
        }

        return neighbors;
    },

    changeTerrain : function( node, newTerrain ) {
        var oldIsPassable = this.terrainFlag.hasTerrain( node.terrain );
        var newIsPassable = this.terrainFlag.hasTerrain( newTerrain );
        node.terrain = newTerrain;

        if( oldIsPassable == newIsPassable ) {
            return;
        }

        this.adjustClearance( node );
        //TODO: Change cameFroms
    },


    _computeFlippedClearance : function( flipped ) {
        if(flipped.x < this.width - 1) {
            if( flipped.y < this.height - 1 ) {
                flipped.clearance = this.data[flipped.y][flipped.x+1].clearance;
                flipped.clearance = Math.min(flipped.clearance, this.data[flipped.y+1][flipped.x+1].clearance );
                flipped.clearance = Math.min(flipped.clearance, this.data[flipped.y+1][flipped.x].clearance   );
                flipped.clearance += 1;
            } else {
                flipped.clearance = 1;
            }
        } else {
            flipped.clearance = 1;
        }
    },

    //TODO: This needs to be fixed
    _addClearance : function( flipped ) {
        this._computeFlippedClearance( flipped );

        var minX = 0;
        for( var i = flipped.y; i >= 0; i-- ) {
            if( flipped.y != i) {
                if( !this.terrainFlag.hasTerrain(this.data[i][flipped.x].terrain) ) {
                    break;
                } else {
                    this._computeFlippedClearance( this.data[i][flipped.x] );
                }
            }
            for( var j = flipped.x-1; j >= minX; j--) {
                var diffX = flipped.x - j;
                var curNode = this.data[i][j];

                if(!this.terrainFlag.hasTerrain(curNode.terrain)) {
                    minX = curNode.x;
                } else {
                    this._computeFlippedClearance( curNode );
                    if( curNode.clearance < diffX ) {
                        break;
                    }
                }
            }
        }
    },

    //see adjust clearance, TODO: Add Comments
    //TODO: Is minX always set 1 to many should it be curNode.x + 1
    _removeClearance : function( flipped ) {
        flipped.clearance = 0;

        var minX = 0;
        for( var i = flipped.y; i >= 0; i-- ) {
            var diffY = flipped.y - i;
            if( flipped.y != i) {
                if( !this.terrainFlag.hasTerrain(this.data[i][flipped.x].terrain) ) {
                    break;
                } else if( this.data[i][flipped.x].clearance > diffY ) {
                    this.data[i][flipped.x].clearance = diffY;
                }
            }
            for( var j = flipped.x-1; j >= minX; j-- ) {
                var limit = Math.max(flipped.x - j, diffY);
                var curNode = this.data[i][j];

                if(!this.terrainFlag.hasTerrain(curNode.terrain)) {
                    minX = curNode.x;
                } else {
                    if(this.data[i][j].clearance > limit ) {
                        this.data[i][j].clearance = limit;
                    } else {
                        break;
                    }
                }
            }
        }
    },

    //Assumes that if node is now passable then it was previously impassable
    //and vice versa.  Adjust clearance now that the map has changed
    //If a lot of tower's are placed/deleted then recomputing all might be
    //more costly then just computing the entire grid.  However, a user (at the moment
    //anyway) can't place multiple tower's very quickly, so adjusting likely amortizes
    //the cost over several frames
    adjustClearance : function( flipped ) {
        var addClearance = this.terrainFlag.hasTerrain( flipped.terrain );

        if( addClearance ) {
            this._addClearance(flipped);
        } else {
            flipped.cameFrom = null;
            this._removeClearance(flipped);
        }
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
        var maxY = Math.min(current.y + requiredClearance, this.height);
        var maxX = Math.min(current.x + requiredClearance, this.width);

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

    //The final node may or may not be end (because end may not have the required clearance
    //but is within required clearance of a node that does have the required clearance)
    foundInPreviousIteration : function( end, requiredClearance ) {
        if( end.cameFrom != null ) {
            return end;
        }

        //This is going to be similar to foundNeigbors but in filterDiagonals
        //we use clearance and the knowledge that the square we occupy has a clearance == requiredClearance
        //In this particular case, end does not have to have a clearance == requiredClearance just a
        //neighbor with requiredClearance that can be navigated to from start.  Therefore the shortcut
        //we use in filterDiagonals does not work
        var neighbors = this.findNeighbors(end, [], requiredClearance, true);
        for( var i = 0; i < neighbors.length; i++ ) {
            if( neighbors[i].cameFrom != null ) {
                if(this.found(requiredClearance, neighbors[i], end)) {
                    return neighbors[i];
                }
            }
        }

        return null;
    },

    findPath : function(start, end, requiredClearance) {
        var openSet = this.openSet;

        var finalPathNode = this.foundInPreviousIteration(end, requiredClearance);
        if( finalPathNode != null ) {
            return this.constructReversedPath(finalPathNode).reverse();
        }

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

    clearFindState : function() {
        for( var i = 0; i < this.height; i++ ) {
            for( var j = 0; j < this.width; j++ ) {
                var node = this.data[i][j];
                node.closed = false;
                node.open   = false;
                node.g = 0;
                node.f = 0;
                node.cameFrom = null;
                this.openSet.clear();
            }
        }
    },

    hashCode : function() {
        return this.id * this.width * this.height * this.terrainFlag;
    }

}