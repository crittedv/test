ig.module(
    'game.entities.Player'
)
.requires(
    'impact.entity',
    'game.ui.decorations.BarMeter'
)
.defines(function(){

    EntityPlayer = ig.Entity.extend({

        name: null,
        maxHealth : 0,
        health    : 0,
        healthMeterUi : null,
        score: 0,
        wallet: 100,
      //  healthMeterYOffset : -1,

        type: ig.Entity.TYPE.NONE,
        animSheet: new ig.AnimationSheet('media/player.png', 64,64),


        getHealth : function() {
            return this.health;
        },

        getPercHealth : function() {
            return this.health / this.maxHealth;
        },

        isDead : function() {
           // console.log("creep health: " + this.name);
            if(this.getHealth() <= 0){
                return true;
            }
            else{
                return false;
            }
        },

        visitExit : function(exit) {
            this.kill();
        },


        init: function( x, y, settings ) {
            this.name = "player";
            this.parent( x,y, settings );
            this.health    = 100;
            this.maxHealth = 100;
            console.log("playername:" + this.name);
            this.addAnim('idle', 1, [0]);
            this.pos.x = x;
            this.pos.y = y;

        },

        update: function() {

            if(this.getHealth() < this.maxHealth)
            {
                console.log("I'm hurt!");
            }

            if(this.isDead()) {
                this.kill();
                ig.game.gameOver();
            }

            this.parent();
        },

        shrink: function() {
            console.log("shrunk");
            this.size.x = this.size.x-6;
            this.size.y = this.size.y-6;
        },

        loseLife: function(){
         //   console.log("ouch!");
            this.health--;
        },

        receivePoints: function(value){
            this.score+=value;
          //  console.log(this.getScore());
        },

        receiveMoney: function(value){
            this.wallet+=value;
           // console.log("wallet: " + this.wallet);
        },

        spendMoney: function(value){
            this.wallet-=value;
        },

        getScore: function(){
            console.log("SCORE: " + this.score);
            return this.score;
        },

        getWallet: function(){
            console.log("WALLET: " + this.wallet);
            return this.wallet;
        }

    });

});

var PlayerUtil = {

    getPlayer: function(){
        return ig.game.getEntityByName("player");
    }

};
