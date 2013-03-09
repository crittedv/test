ig.module(
    'game.entities.Waypoint'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityWaypoint = ig.Entity.extend({
        size: {x: 16, y: 16},
        target: {},
        checkAgainst: ig.Entity.TYPE.B,

        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(196, 255, 0, 0.7)',

        name : null,

        check: function( other ) {
            console.log("WAYPOINT");
            if(TypeUtil.hasProp(other,"visitWaypoint")) {
                other.visitWaypoint(this);
            }
        }
    });
});