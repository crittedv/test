ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
    'game.entities.Tower',
    'game.entities.Enemy',
    'game.entities.Death',
    'game.entities.Placement',
    'game.entities.Projectile',
    'game.entities.Player',
    'game.levels.test',


    'game.ui.hud.PlacementOverlay',

    'plugins.RichMap',
    'plugins.RichCollisionMap',
    'plugins.astar-for-entities-debug',

    'plugins.astar-for-entities'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
    towerPlacement : new PlacementOverlay("TowerPlacement", {x:64, y:64}),
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
        ig.input.bind( ig.KEY.MOUSE1, 'leftButton' );
        ig.input.bind( ig.KEY.MOUSE2, 'rightButton' );

        this.loadLevel( LevelTest );
       // this.player = ig.game.getEntityByName("player");
	},
	
	update: function() {

		// Update all entities and backgroundMaps
        this.towerPlacement.show();
        this.towerPlacement.update();
		this.parent();
      //  console.log(PlayerUtil.getScore());
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
        this.drawCursorLoc();
        this.font.draw('Score: ' + PlayerUtil.getPlayer().getScore(), 5, 5, ig.Font.ALIGN.LEFT);
   //     this.font.draw( 'Score ' + (PlayerUtil.getScore()), this.drawCoordinates.score.x, this.drawCoordinates.score.y, ig.Font.ALIGN.CENTER );
   //     this.font.draw( 'Lives: ' + (this.playerController.lives-1), this.drawCoordinates.lives.x, this.drawCoordinates.lives.y, ig.Font.ALIGN.CENTER );

	},

    drawCursorLoc : function() {
        // Add your own drawing code here
        var x = ig.system.width - 100,
            y = ig.system.height - 60;

        var loc = {x : ig.input.mouse.x, y : ig.input.mouse.y};
        this.font.draw( 'Mouse Loc: ( ' + loc.x + ", " + loc.y + ')',
             x, y, ig.Font.ALIGN.CENTER );
        y += 30;
        var tileIndex = this.collisionMap.getTileIndices(loc);
        var tileStr = "Collision Index: ("
        if(tileIndex == 0) {
          tileStr += "Failure";
        } else {
          tileStr += tileIndex.x + ", " + tileIndex.y;
        }
        tileStr += " )";
        this.font.draw( tileStr, x, y, ig.Font.ALIGN.CENTER);
    }
});


// Start the Game with 60fps, a resolution of 640x480, scaled
// up by a factor of 1
ig.main( '#canvas', MyGame, 60, 1280, 720, 1 );

});
