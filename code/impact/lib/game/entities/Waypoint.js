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
        next : null,

        check: function( other ) {
            console.log("WAYPOINT");
            if(TypeUtil.hasProp(other,"visitWaypoint")) {
                other.visitWaypoint(this);
            }
        },

        update : function() {
            if(TypeUtil.isEmpty(this.path) && !TypeUtil.isEmpty(this.next)) {
                var nextWaypoint = ig.game.getEntityByName(this.next);
                this.getPath(nextWaypoint.pos.x, nextWaypoint.pos.y, false, [/*'EntityEnemy'*/]);
                this.followPath(0);
            }
        }
    });
});
