ig.module(
	'game.entities.Tower'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityTower = ig.Entity.extend({
        zIndex: 10,
        size: {x: 48, y:48},
        collides: ig.Entity.COLLIDES.FIXED,

        animSheet: new ig.AnimationSheet('media/tower.png', 48,48),
        init:function( x, y, settings ) {
            this.addAnim('idle', 0.1, [0]);
            this.parent( x,y, settings );
        }
    });
});
