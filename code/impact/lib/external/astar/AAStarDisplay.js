
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

function updateDisplay(grid) {
    for(var i = 0; i < grid.width; i++) {
        for(var j = 0; j < grid.height; j++) {
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

                /*
                var $curTd =     $("#" + current.x     + "_" + current.y    );
                $curTd.removeClass("passable");
                $curTd.addClass("current");

                if(prevCurrent != null) {
                    var $prevCurTd = $("#" + prevCurrent.x + "_" + prevCurrent.y);
                    $prevCurTd.removeClass("current");
                    $prevCurTd.addClass("passable");
                } */
            }
        }
    }
}

function displayData(tableId, grid) {
    var data = grid.data;
    $table = $("#" + tableId);
    for(var y = 0; y < grid.height; y++) {
        var tr = "<tr>";
        for(var x = 0; x < grid.width; x++) {
            var id = x + "_" + y;
            tr += '<td class="' + Terrain[data[y][x].terrain] + '" ' +
                'id="' + id + '" title="' + id + ' ' + data[y][x].clearance + '" ></td>';
        }

        tr += "</tr>";
        $table.append(tr);
    }
}

function drawPath(start, path, grid, clearance) {

    if( path == null ) {
        var $startTd = $("#" + start.id);
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
}