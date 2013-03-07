ig.module(
	'game.entities.towers.towers'
)
.requires(
	'impact.entity'
)
.defines(function(){

        EntityTower = ig.Entity.extend({
            size: {x: 48, y:48},
            collides: ig.Entity.COLLIDES.FIXED,

            animSheet: new ig.AnimationSheet('media/towers.png', 48,48),
            init:function( x, y, settings ) {
                this.parent( x,y, settings );
            }
        });
});
