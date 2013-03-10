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

        spawnRate : 5, //10 seconds
        name  : null,
        next  : null,
        timer : null,

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
        },

        spawn : function() {
            var center = this.centerPos();
            var settings = {};
            settings.waypoint = this.next;
            ig.game.spawnEntity(EntityEnemy, center.x, center.y, settings);
        }
    });
});