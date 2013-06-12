/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 6/10/13
 * Time: 9:12 PM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.pathing.TerrainFlag'
)
.requires(
)
.defines(function () {

   //TODO: Add comments and add methods "addTerrain", "removeTerrain"
   TerrainFlag = ig.Class.extend({
       flag : 0,

        init: function () {
            if(arguments.length > 0) {
                this.flag = arguments[0];
                for(var i = 1; i < arguments.length; i++) {
                    this.flag |= arguments[i];
                }
            }
        },

        hasTerrain : function(terrain) {
            return (this.flag & terrain) >= 1;
        }
    });

});