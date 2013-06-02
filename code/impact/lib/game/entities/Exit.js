ig.module(
    'game.entities.Exit'
)
.requires(
    'impact.entity'
)
.defines(function () {
    EntityExit = ig.Entity.extend({
        size: {x: 16, y: 16},
        target: {},
        checkAgainst: ig.Entity.TYPE.B,

        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(150, 50, 50, 0.5)',

        check: function( other ) {
            console.log("EXIT");
            if(TypeUtil.hasProp(other,"visitExit")) {
                other.visitExit(this);
            }
            EntityPlayer = ig.game.getEntityByType(EntityPlayer);
        }
    });
});
