/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 4/17/13
 * Time: 7:48 PM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.entities.Death'
)
.requires(
    'impact.entity'
)
.defines(function () {

    EntityDeath = ig.Entity.extend({

        animSheet : null,

        init: function (x, y, settings) {
            this.parent( x,y, settings );

            this.animSheet = settings.animSheet;
            var deathAnim = settings.deathAnim;
            this.addAnim(deathAnim.name, deathAnim.frameTime, deathAnim.sequence, true);
            this.size  = settings.size;
        },

        update : function() {
            if(this.currentAnim.loopCount > 0) {
                this.kill();
            }
            this.parent();
        }
    });

});