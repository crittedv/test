
function id(x, y) {
    return x + "_" + y;
}

function makeNode(x, y, blocked) {
    return {
        x: x,
        y: y,
        blocked :blocked,
        id: id( x, y ),
        closed : false,
        open   : false,
        g : 0,
        f : 0,
        cameFrom : null,
        clearance : 0
    };
}


function doUntil(actionFunc, conditionFunc, delay, onFinish) {

    if(!conditionFunc()) {
        actionFunc();
        setTimeout(
            function() { doUntil(actionFunc, conditionFunc, delay, onFinish) },
            delay
        );
    } else {
        if((typeof onFinish) != "undefined") {
            onFinish();
        }
    }
}

function generateBoard(xDim, yDim) {
    var data = [];

    var chanceBaseline = 0.90;
    var unblockedStep = -0.6;
    var blockedStep   =  0.3;

    var prevWasBlocked = false;
    var chance = chanceBaseline;

    for(var i = 0; i < yDim; i++) {
        data[i] = [];
        for(var j = 0; j < xDim; j++) {
            var blocked = Math.random() > chance;
            chance += blocked ? blockedStep : unblockedStep;
            if(chance < 30 || chance > 87 ) {
                chance = chanceBaseline;
            }

            data[i][j] = makeNode(j, i, blocked ? 1 : 0);
        }
    }
    return data;
}

function chooseNode(grid) {
    var x = Math.floor(Math.random() * grid.size.x);
    var y = Math.floor(Math.random() * grid.size.y);

    return grid.data[y][x];
}

function chooseOpenNode(grid) {
    var node = chooseNode(grid);
    while(node.blocked) {
        node = chooseNode(grid);
    }
    return node;
}

function displayData(tableId, grid) {
    $table = $("#" + tableId);
    for(var y = 0; y < grid.size.y; y++) {
        var tr = "<tr>";
        for(var x = 0; x < grid.size.x; x++) {
            var id = x + "_" + y;
            tr += '<td class="' + (grid.data[y][x].blocked ? "impassable" : "passable") + '" ' +
                      'id="' + id + '" title="' + id + ' ' + grid.data[y][x].clearance + '" ></td>';
        }

        tr += "</tr>";
        $table.append(tr);
    }
}

function makeGrid() {

    var grid = {
        size : {x : 40, y: 40},
        data : generateBoard(40, 40)
    };

    return grid;
}

var cfClasses = [
    "cameFrom0",
    "cameFrom1",
    "cameFrom2",
    "cameFrom3",
    "cameFrom4",
    "cameFrom5",
    "cameFrom6",
    "cameFrom7"
];

function updateDisplay(grid, current, prevCurrent) {
    for(var i = 0; i < grid.size.x; i++) {
        for(var j = 0; j < grid.size.y; j++) {
            var node = grid.data[j][i];
            var cameFrom = node.cameFrom;
            if(cameFrom != null) {
                var xDiff = cameFrom.x - node.x;
                var yDiff = cameFrom.y - node.y;

                var coordToCf = { };
                coordToCf[ "0,-1" ]  = 0;
                coordToCf[ "1,-1" ]  = 1;
                coordToCf[ "1,0"  ]  = 2;
                coordToCf[ "1,1"  ]  = 3;
                coordToCf[ "0,1"  ]  = 4;
                coordToCf[ "-1,1" ]  = 5;
                coordToCf[ "-1,0" ]  = 6;
                coordToCf[ "-1,-1"]  = 7;

                var cfClass = cfClasses[ coordToCf[xDiff + "," + yDiff] ];
                var $td = $("#" + node.x + "_" + node.y);
                for( var z = 0; z < cfClasses.length; z++ ) {
                    $td.removeClass(cfClasses[z]);
                }
                $td.addClass(cfClass);

                var $curTd =     $("#" + current.x     + "_" + current.y    );
                $curTd.removeClass("passable");
                $curTd.addClass("current");

                if(prevCurrent != null) {
                    var $prevCurTd = $("#" + prevCurrent.x + "_" + prevCurrent.y);
                    $prevCurTd.removeClass("current");
                    $prevCurTd.addClass("passable");
                }
            }
        }
    }
}

function drawPath(start, path) {

    if( path == null ) {
        var $startTd = $("#" + start.id);
        $startTd.removeClass("start");
        $startTd.addClass("noPath");

    } else {
        for(var i = 0; i < path.length; i++) {
            var node = path[i];
            if(node.blocked) {
                alert("Node on list but blocked " + node.id);
            }

            var $td = $("#" + path[i].id);
            $td.removeClass("passable");
            $td.addClass("path");
        }
    }
}

//Uses hierarchical A* article's notion of clearance but uses previously computed
//values to continue to compute clearance
function computeClearance(grid) {
    var data = grid.data;
    for( var j = 0; j < grid.size.y; j++ ) {
        for(var i = 0; i < grid.size.x; i++) {
            var currentNode = data[j][i];
            if(currentNode.blocked)  {
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

                if( i2 < grid.size.x && jMax < grid.size.y ) {
                    for(var j2 = j; j2 < jMax && clear; j2++) {
                        if( data[j2][i2].blocked ) {
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

                if( iMax < grid.size.x && j2 < grid.size.y ) {
                    for(var i2 = i; i2 < iMax && clear; i2++) {
                        if( data[j2][i2].blocked ) {
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

                if( i2 < grid.size.x && j2 < grid.size.y ) {
                    for(var z = 0; z < currentNode.clearance && i+z < grid.size.x; z++ ) {
                        if( data[j2][i+z].blocked ) {
                            clear = false;
                        }
                    }

                    for(var z = 0; z < currentNode.clearance && j+z < grid.size.y; z++ ) {
                        if( data[j+z][i2].blocked ) {
                            clear = false;
                        }
                    }

                    data[j+z][i2].blocked

                    clear = clear && !data[j2][i2].blocked;
                    if( clear ) {
                        currentNode.clearance += 1;
                    }
                } else {
                    clear = false;
                }
            }
        }
    }
}

function findPath(start, end, requiredClearance, grid) {


    //==================
    // Private Functions

    function distance(node1, node2) {
        var xDistance = Math.abs(node1.x - node2.x);
        var yDistance = Math.abs(node1.y - node2.y);

        var h;
        if( xDistance > yDistance ) {
            h = 14*yDistance + 10*(xDistance-yDistance);
        } else {
            h = 14*xDistance + 10*(yDistance-xDistance)
        }

        return h;
    }

    function findNeighbors(node, requiredClearance, grid) {
        var i = 0;
        var data = grid.data;
        var neighbors = [];

        var xGreaterThanMin = node.x > 0;
        var xLessThanMax    = node.x < (grid.size.x - 1);

        var yGreaterThanMin = node.y > 0;
        var yLessThanMax   = node.y < (grid.size.y - 1);

        var x = node.x;
        var y = node.y;
        var xMinus1 = x - 1;
        var xPlus1  = x + 1;
        var yMinus1 = y - 1;
        var yPlus1  = y + 1;

        function add(y, x) {
            if( !data[y][x].blocked && data[y][x].clearance >= requiredClearance ) {
                neighbors[i++] = data[y][x];
            }
        }

        if( xGreaterThanMin ) {
            add( y, xMinus1 );

            if( yGreaterThanMin ) {
                //Don't allow a diagonal if a corner would block it
                if( !(data[y][xMinus1].blocked || data[yMinus1][x].blocked) ) {
                    add( yMinus1, xMinus1 );
                }

                add( yMinus1, x      );

                if( xLessThanMax ) {
                    //Don't allow a diagonal if a corner would block it
                    if( !( data[yMinus1][x].blocked || data[y][xPlus1].blocked) ) {
                        add( yMinus1, xPlus1 );
                    }
                }
            }

            if( yLessThanMax ) {
                add( yPlus1, x );

                //Don't allow a diagonal if a corner would block it
                if( !( data[y][xMinus1].blocked || data[yPlus1][x].blocked ) ) {
                    add( yPlus1, xMinus1 );
                }

                if( xLessThanMax ) {
                    //Don't allow a diagonal if a corner would block it
                    if( !( data[yPlus1][x].blocked || data[y][xPlus1].blocked ) ) {
                        add( yPlus1, xPlus1 );
                    }
                }
            }

            if( xLessThanMax ) {
                add( y, xPlus1 );
            }

        } else { //x is min (and definitely less than max
            add( y, xPlus1 );

            if( yGreaterThanMin ) {
                add( yMinus1, x      );

                if( !( data[yMinus1][x].blocked || data[y][xPlus1].blocked) ) {
                    add( yMinus1, xPlus1 );
                }
            }

            if( yLessThanMax ) {
                add( yPlus1, x      );

                if( !( data[yPlus1][x].blocked || data[y][xPlus1].blocked ) ) {
                    add( yPlus1, xPlus1 );
                }
            }
        }

        return neighbors;
    }

    /**
     * Navigation is done from the top-left square of the enitity for which
     * we are finding a path.
     * @param requiredClearance
     * @param current
     * @param end
     * @param grid
     *
     * Note as far as the found method is concerned the angle that our
     * searcher faces never changes but you could use the current.cameFrom
     * to angle its icon
     *
     *
     */
    function found( requiredClearance, current, end, grid ) {

        var maxY = current.y + requiredClearance;
        var maxX = current.x + requiredClearance;

        for( var i = current.x; i < maxX; i++ ) {
            for( var j = current.y; j < maxY; j++) {
                if( grid.data[j][i] == end ) {
                    return true;
                }
            }
        }

        return false;
    }

    function reverseWalkPath(current) {
        var path = [ current ];
        while(current.cameFrom != null) {
            path[path.length] = current;
            current = current.cameFrom;
        }

        return path;
    }

    function computeH(node) { return distance(node, end); }

    var openSet   = new BinaryHeap(function(n){ return n.f; });
    //At the moment, since we only ever test the inclusion of a node in closedSet (rather than
    //iterating over closed set, we can omit it and just keep a closed field on the node)
    //cameFrom is also a field on the node rather than a map

    openSet.push(start);

    start.g = 0;
    start.f = start.g + computeH(start);


    var path = null;
    var iteration = 0;
    var prevCurrent = null;

    function iterate() {
        alert("Starting iteration: " + iteration++);
        var current = openSet.pop();

        if( found( requiredClearance, current, end, grid) ) {
            path = reverseWalkPath(current).reverse();
        }

        current.open = false;
        current.closed = true;

        var neighbors = findNeighbors( current, requiredClearance, grid );
        for( var i = 0; i < neighbors.length; i++ ) {
            var neighbor = neighbors[i];
            var tentativeG = current.g + distance( current ,neighbor );
            if( neighbor.closed && tentativeG >= neighbor.g ) {
                continue;
            }

            if( !neighbor.open || tentativeG < neighbor.g ) {
                neighbor.g = tentativeG;
                neighbor.cameFrom = current;
                neighbor.f = neighbor.g + computeH(neighbor);

                if( !neighbor.open ) {
                    neighbor.open = true;
                    openSet.push(neighbor);
                }
            }
        }

        updateDisplay(grid, current, prevCurrent);
        prevCurrent = current;
    }

    doUntil(iterate, function(){ return openSet.size() == 0 || path !=  null; }, 50, function(){drawPath(start, path);});
}