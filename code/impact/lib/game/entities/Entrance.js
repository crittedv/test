ig.module(
    'game.entities.Entrance'
)
.requires(
    'impact.entity'
)
.defines(function () {
    EntityEntrance = ig.Entity.extend({
        size: {x: 16, y: 16},

        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(150, 22, 190, 0.5)',

        spawnRate : 1, //10 seconds
        name  : null,
        next  : null,
        timer : null,
        enitityNum : 0,

        update : function() {
            if(this.timer == null) {
                this.timer = new ig.Timer();
                this.spawn();
                this.timer.set(this.spawnRate);
            } else {
                if(this.timer.delta() >= 0) {
                    this.spawn();
                    this.timer.set(this.spawnRate);
                }
            }

            if(TypeUtil.isEmpty(this.path) && !TypeUtil.isEmpty(this.next)) {
                var nextWaypoint = ig.game.getEntityByName(this.next);
                this.getPath(nextWaypoint.pos.x, nextWaypoint.pos.y, false, [/*'EntityEnemy'*/]);
                this.followPath(0);
            }
        },

        spawn : function() {
            var center = this.centerPos();
            var settings = {};
            settings.waypoint = this.next;
            settings.name = settings.name = "enemy_" + this.enitityNum++;
            ig.game.spawnEntity(EntityEnemy, center.x, center.y, settings);
        }
    });
});
