function AAStarDisplay(ids) {
    this.ids = ids;
    this.grid = null;
    this.start = null;
    this.end   = null;
    this.pathResults = [];
    this.clearanceIsComputed = false;
    this.timeComputingClearance = 0;

    this.pressed = {};

    this.cfClasses = [
        "cameFrom0",
        "cameFrom1",
        "cameFrom2",
        "cameFrom3",
        "cameFrom4",
        "cameFrom5",
        "cameFrom6",
        "cameFrom7"
    ];
}

AAStarDisplay.prototype = {
    nodeToTd : function( node ) {
        return $("#" + node.x + "_" + node.y);
    },

    tdToNode : function( td ) {
        var x_y = td.id.split("_");
        return this.grid.data[parseInt(x_y[1],10)][parseInt(x_y[0],10)];
    },


    makeGrid : function() {
        this.grid = new Grid(new TerrainFlag(Terrain.Land, Terrain.Water), 40, 40, Terrain.Land, [
            new TerrainConstraints(Terrain.Water,.10, null, null, null, null),
            new TerrainConstraints(Terrain.Rock, .09, null, null, null, null)
        ]);
        this.clearanceIsComputed = false;
        this.pathResults = [];
        this.start = null;
        this.end = null;
    },


    displayData : function(globalVarName) {
        var grid = this.grid;
        var data = this.grid.data;
        $table = $("#" + this.ids.gridTable);
        $table.html("");
        for(var y = 0; y < grid.height; y++) {
            var tr = "<tr>";
            for(var x = 0; x < grid.width; x++) {
                var id = x + "_" + y;
                tr += '<td class="' + Terrain[data[y][x].terrain] + '" ' +
                    'id="' + id + '" title="' + id + ' ' + data[y][x].clearance + '" onclick="' + globalVarName + '.clickOnTd(this);"></td>';
            }

            tr += "</tr>";
            $table.append(tr);
        }
    },

    updateDisplay : function() {
        var cfClasses = this.cfClasses;
        var grid = this.grid;
        for(var i = 0; i < grid.width; i++) {
            for(var j = 0; j < grid.height; j++) {
                var node = grid.data[j][i];
                var cameFrom = node.cameFrom;
                var $td = $("#" + node.x + "_" + node.y);
                $td.attr("title", node.id + " " + node.clearance);

                if( node == this.start) {
                    this.flipNodeClass(node, "start");
                } else if( node == this.end ){
                    this.flipNodeClass(node, "end");
                } else {
                    if($td.hasClass("flippedToRock")) {
                        this.flipNodeClass(node, "flippedToRock");
                    } else if( $td.hasClass("flippedToLand") ) {
                        this. flipNodeClass(node, "flippedToLand");
                    } else {
                        this.flipNodeClass(node, Terrain[node.terrain]);
                    }
                }

                if( node != this.end ) {
                    $td.removeClass("end");
                } else {
                    $td.addClass("end");
                }

                for( var z = 0; z < cfClasses.length; z++ ) {
                    $td.removeClass(cfClasses[z]);
                }

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
                    $td.addClass(cfClass);
                }
            }
        }

        if( this.pathResults.length > 0 ) {
            var pathResult = this.pathResults[this.pathResults.length - 1];
            this.drawPath(pathResult.path, pathResult.clearance);
            $("#" + this.ids.lastPath).html(pathResult.time + " ms");

            var avgTime = 0;
            for(var i = 0; i < this.pathResults.length; i++) {
                avgTime += this.pathResults[i].time;
            }
            avgTime /= this.pathResults.length;
            $("#" + this.ids.avgTime).html(avgTime + " ms");
        }

        $("#" + this.ids.clearance).html(this.timeComputingClearance + " ms");
    },

    flipNodeClass : function(node, newClass) {
        var $nodeTd = this.nodeToTd(node);
        $nodeTd.removeClass("start");
        $nodeTd.removeClass("end");
        $nodeTd.removeClass("path");
        $nodeTd.removeClass("Land");
        $nodeTd.removeClass("Water");
        $nodeTd.removeClass("Rock");
        $nodeTd.removeClass("flippedToRock");
        $nodeTd.removeClass("flippedToLand");
        $nodeTd.addClass(newClass);
    },

    drawPath : function(path, clearance) {
        var grid = this.grid;
        if( path == null ) {
            var $startTd = $("#" + this.start.id);
            $startTd.removeClass("start");
            $startTd.addClass("noPath");

        } else {
            for(var z = 0; z < path.length; z++) {
                var node = path[z];

                for(var i = 0; i < clearance; i++) {
                    for(var j = 0; j < clearance; j++) {
                        var drawPathNode = grid.data[node.y + i][node.x + j];

                        var $td = $("#" + drawPathNode.id);
                        $td.addClass("path");
                    }
                }
            }
        }
    },

    clickOnTd : function( td ) {
        var CTRL  = 17;
        var SHIFT = 16;
        if( this.pressed[SHIFT] ) {
            this.setStart( td );
        } else if( this.pressed[CTRL] ) {
            this.setEnd( td );
        } else {
            this.flip(td);
        }
        this.updateDisplay();
    },

    flip : function(td) {
        var node = this.tdToNode(td);

        if( node.terrain == Terrain.Land || node.terrain == Terrain.Water ) {
            this.grid.changeTerrain( node, Terrain.Rock );
            this.flipNodeClass(node, "flippedToRock");
        } else {
            this.grid.changeTerrain( node, Terrain.Land );
            this.flipNodeClass(node, "flippedToLand");
        }
        this.updateDisplay();
    },

    registerKeyListener : function() {
        document.onkeydown=function(e){
            e = e || window.event;
            this.pressed[e.keyCode] = true;
        }.bind(this);

        document.onkeyup=function(e) {
            e = e || window.event;
            this.pressed[e.keyCode] = false;
        }.bind(this);
    },

    setStart : function( td ) {
        this.start = this.tdToNode(td);
        this.grid.clearFindState();
    },

    setEnd : function( td ) {
        this.end  = this.tdToNode(td);
    },

    computeClearance : function(updateDisplay) {
        var startTime = new Date();
        this.grid.computeClearance();
        var endTime = new Date();
        this.timeComputingClearance = endTime.getTime() - startTime.getTime();
        this.clearanceIsComputed = true;
        if(typeof updateDisplay != "undefined" && updateDisplay) {
            this.updateDisplay();
        }
    },

    runPathFinder : function( clearance ) {

        if(!this.clearanceIsComputed) {
            this.computeClearance();
        }

        var startTime = new Date();
        var path = this.grid.findPath( this.start, this.end, clearance );
        var endTime = new Date();
        var elapsedTime = endTime - startTime;

        this.pathResults.push({path : path, time : elapsedTime, clearance : clearance});
        this.drawPath(path, clearance);
        this.updateDisplay( );
    }
} //$("#yourtableid tr").remove();
/*
var startTime = new Date().getTime();
grid.computeClearance();
var endTime = new Date().getTime();

var totalTime = endTime -startTime;
var start = grid.chooseOfWClearance(Terrain.Land, clearance);
var end1 = grid.chooseOfWClearance(Terrain.Land, clearance);
while(start == end1) {
    end1 =  grid.chooseOfWClearance(Terrain.Land, clearance);
}

startTime = new Date().getTime();
var path1 = grid.findPath(start, end1, clearance);
endTime = new Date().getTime();
totalTime += endTime - startTime;


var end2 = grid.chooseOfWClearance(Terrain.Land, clearance);
while(start == end2) {
    end2 = grid.chooseOfWClearance(Terrain.Land, clearance);
}

startTime = new Date().getTime();
var path2 = grid.findPath(start, end2, clearance);
endTime = new Date().getTime();
totalTime += endTime - startTime;

displayData("data", grid);

var $startTd = nodeToTd(start);
$startTd.removeClass("Land");
$startTd.removeClass("Water");
$startTd.removeClass("Rock");
$startTd.addClass("start");

updateDisplay(grid);
drawPath(start, path1, grid, clearance);
drawPath(start, path2, grid, clearance);

var $endTd1 = nodeToTd(end1);
$endTd1.removeClass("Land");
$endTd1.removeClass("Water");
$endTd1.removeClass("Rock");
$endTd1.addClass("finish");

var $endTd2 = nodeToTd(end2);
$endTd2.removeClass("Land");
$endTd2.removeClass("Water");
$endTd2.removeClass("Rock");
$endTd2.addClass("finish");

$("body").prepend("<h2>" + totalTime + " ms </h2>");*/