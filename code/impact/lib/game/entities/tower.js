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

        //checking against enemies, theoretically
        checkAgainst: ig.Entity.TYPE.B,

        //WTF are these
        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(196, 255, 0, 0.7)',

        // set lockedOn to true when firing at an enemy in range
        lockedOn: false,
        // list of targets?
        target: null,
        // test range
        range: 20,
        rateOfFire: .2,
        fireTimer: null,


        animSheet: new ig.AnimationSheet('media/tower.png', 48,48),
        init:function( x, y, settings ) {
            this.addAnim('idle', 1, [0]);
            this.pos.x = x;
            this.pos.y = y;
            this.parent( x,y, settings );
            this.fireTimer =  new ig.Timer(this.rateOfFire);

        },

        check: function(other){
            if(other instanceof EntityEnemy){

                console.log("RANGE CHECK: within 10?");
                console.log(other.distanceTo(this));

                if(!this.lockedOn){
                    console.log("SEARCHING.....");
                    if(other.distanceTo(this) <= this.range){
                        //Should there be a list of potential targets,
                        //or should we just take the first one within range?

                        //Also need some way to track who is targetting dead things
                        //(e.g. reset tower targets

                        //First one for now...
                        this.lockedOn = true;
                        this.target = other.name;
                    }
                }
                else{
                    console.log("Locked on to Target:" + this.target);
                    console.log("Testing");
                    if(other.health > 0){
                        if(other.distanceTo(this)> this.range){
                            console.log("   out of range!");
                            this.resetTarget();
                        }
                        else if(this.lockedOn && other.distanceTo(this) <= this.range){
                            if(this.fireTimer.delta() > this.rateOfFire){
                                console.log("   FIRE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                            }
                            else{
                                console.log("   RELOAD");
                            }
                            this.fireTimer.reset();
                            //now calculate damage
                            //determine whether or not the object dies? or should some
                            //governing body do that?
                            // check it's health, reset locks & targets accoringly
                        }
                        else{
                            console.log("else!");
                        }
                    }
                    else{
                        console.log("Shit's dead Jim!!!");
                        this.resetTarget();
                    }
                }


            }
        },
        resetTarget: function() {
            this.lockedOn = false;
            this.target = null;
        }

    });
});
