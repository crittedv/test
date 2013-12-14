ig.module(
	'game.entities.Tower'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityTower = ig.Entity.extend({
        zIndex: 10,
        size: {x: 64, y:64},
        name: null,

        collides: ig.Entity.COLLIDES.FIXED,

        //checking against enemies, theoretically
        checkAgainst: ig.Entity.TYPE.B,

        //WTF are these
        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(196, 255, 0, 0.7)',

        // set lockedOn to true when firing at an enemy in range
        lockedOn: false,
        // current target
        target: null,
        // test range
        range: 200,
        angle: 0,
        rateOfFire:.2,
        fireTimer: null,
        damage: 10,
        cost: 100,

        // flag for if the user has this tower selected
        isSelected: false,

        animSheet: new ig.AnimationSheet('media/tower64x64.png', 64,64),
        init:function( x, y, settings ) {
            this.addAnim('idle', 1, [0]);
            this.pos.x = x;
            this.pos.y = y;
            this.parent( x,y, settings );
            this.fireTimer =  new ig.Timer(this.rateOfFire);

        },

        draw: function(){
            this.parent();
            if(this.isSelected){

                var ctx = ig.system.context;
                ctx.strokeStyle = "red";  //some color
                ctx.beginPath();
                //ctx.arc( ig.system.getDrawPos( this.pos.x ),// - ig.game.screen.x ),
                //    ig.system.getDrawPos( this.pos.y ),// - ig.game.screen.y ),
                ctx.arc( ig.system.getDrawPos( this.centerPos().x ),// - ig.game.screen.x ),
                    ig.system.getDrawPos( this.centerPos().y ),// - ig.game.screen.y ),
                    this.range * ig.system.scale,
                    0, Math.PI * 2 );
                ctx.stroke();

            }
        },

        /**
         * This update function:
         *    - Checks to see if the user has selected the tower
         *    - Targets & fires at bad guys
         *    - Rotates the tower to follow it's target
         *    - Searches for & resets the tower's targets
         */
        update: function(){
            this.parent();

            if (ig.input.pressed('leftButton') ){
                if(this.inFocus()) {
                    //console.log('CLICKED');
                    this.isSelected = true;
                }
                else{
                    this.isSelected = false;
                }
                console.log("Mouse: " + ig.input.mouse.x + " : " + ig.input.mouse.y);
            }

            if(this.lockedOn){
                //console.log("LOCKED ON");
                if(this.target!=null && this.target != undefined){
                    var targetBadGuy = this.target;
                    if(this.distanceTo(targetBadGuy) > this.range){
                        this.resetTarget();
                    }
                    else{

                        this.currentAnim.angle = this.angleTo(targetBadGuy);
                        if(this.fireTimer.delta() > this.rateOfFire){
                            //console.log("   FIRE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+ this.damage);
                          //  console.log("tower x,y: " + this.pos.x + "," + this.pos.y);
                            bullet = this.spawn();
                     //       console.log("bullet x,y: " + bullet.pos.x + "," + bullet.pos.y);
                            this.fireTimer.reset();

                            //roll attack
                            //game.spawn projectile (here is an image, here is your attack, here is your target
                            //projectile
                            //targetBadGuy.health -= 20;
                            if(targetBadGuy.isDead()){
                                  //  console.log("SHIT'S DEAD JIM!");
                                    targetBadGuy.kill(); //TODO: I think this should be left to the entity, but we need
                                                         //TODO: perhaps add a LISTENER METHOD to enemies
                                    this.resetTarget();
                                if(bullet != undefined && bullet != null){
                                    bullet.kill();
                                }
                            }
                        }
                        else{
                            //console.log("   RELOAD");
                        }
                    }
                }
                else{
                    this.resetTarget();
                }
            }
            else{
               // console.log("This.name1: " + this.name);
                //console.log("SEARCHING");
                this.searchForTarget();

            }
        },

        /**
         * Determines which creep to lock on to
         */
        searchForTarget: function() {

          /*
            var closest_creep;
            var closest_distance;
            var creeps= [];   */
            //console.log("This.name2: " + this.name);

            creeps = CombatUtil.getEntitiesInRange(EntityEnemy,this);

            if(creeps.length  > 0 ){
                for(var i=0;i<creeps.length;i++){
                    //console.log("                                                 TESTING CREEP: " + i);
                    if(!(creeps[i]===undefined)&&!(creeps[i]===null)){

                        creep=creeps[i];
                       // console.log("                                                      name: " + creep.name);

                        if(creep.isDead()){
                          //  console.log("CREEP IS DEAD");
                            continue;
                        }

                        this.target = creep;
                        this.lockedOn = true;
                        break;

                        /*
                        May use depending on chosen AI going forward
                        if(!closest_creep){
                            closest_creep=creep;
                            closest_distance=distance;
                        }
                        else{
                            if(distance<closest_distance){
                                closest_creep=creep;
                                closest_distance=distance;
                            }
                        }
                        */
                    }
                    else{
                        break;
                    }
                }
            }
            else{
               // console.log("NO CREEPS AVAILABLE!");
            }

        },

        /**
         * Determines if the detected mouse click was on this tower.
         * @returns boolean - whether or not the user selected the tower.
         */
        inFocus: function() {
            return (
                (this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
                    ((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
                    (this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
                    ((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
                );
        },

        /**
         * This should determine the angle & position of the bullet to be WTFed.
         * @returns {{x: *, y: *, sin: *, cos: *}}
         */
        calculateAngle: function() {
            sinAngle = Math.sin(this.anims.idle.angle);
            cosAngle = Math.cos(this.anims.idle.angle);
            bulletX = (this.pos.x + this.size.x/2) + (-1 * sinAngle);
            bulletY = (this.pos.y + this.size.y/2) - (cosAngle);
            return {x: bulletX, y: bulletY, sin: sinAngle, cos: cosAngle};
        },

        /**
         * Function to create the projectile being hurled towards the evil doers.
         * @returns EntityProjectile - the object of destruction.
         */
        spawn : function() {

            trajectory = this.calculateAngle();

            var settings = {};
            settings.target = this.target;
            settings.vel = {x: trajectory.sin, y: -trajectory.cos};
            settings.flip = this.flip;
            settings.tower = this;
            settings.damage = this.damage;
            settings.range = this.range;
            settings.angle = this.angleTo(this.target);
            settings.size = {x:8, y:8};


           return ig.game.spawnEntity( EntityProjectile, trajectory.x, trajectory.y, settings );
        },

   /*     inCircle: function(radius) {
            var center = { x: (this.pos.x + this.size.x/2), y: (this.pos.y + this.size.y/2) };
            var pos = { x: ig.input.mouse.x + ig.game.screen.x, y: ig.input.mouse.y + ig.game.screen.y };
            return (Math.pow((pos.x - center.x),2) + Math.pow((pos.y - center.y),2) <= Math.pow(radius,2));
        }, */

    /*   check: function(other){
            this.parent();
            console.log("RANGE CHECK: within 10?");
            if(other instanceof EntityEnemy){

               // console.log("RANGE CHECK: within 10?");
               // console.log(other.distanceTo(this));

                if(!this.lockedOn){
                    console.log("SEARCHING.....");
                    if(this.distanceTo(other) <= this.range){
                        //Should there be a list of potential targets,
                        //or should we just take the first one within range?

                        //Also need some way to track who is targeting dead things
                        //(e.g. reset tower targets

                        //First one for now...
                        this.lockedOn = true;
                        this.target = other.name;
                    }
                }
                else{
                    console.log("Locked on to Target:" + this.target);
                    //console.log("Testing");

                    if(this.distanceTo(ig.getEntityByName(this.target)) > this.range){
                        this.resetTarget();

                    }
                    if(other.health > 0){
                        if(this.distanceTo(other)> this.range){
                            console.log("   " + other.name + "is out of range:" + this.range + " distance:" + this.distanceTo(other));
                            this.resetTarget();
                        }
                        else if(this.lockedOn && other.distanceTo(this) <= this.range){
                            //rotate to follow the target
                            console.log("      angle_to " + other.name + ": " + this.angleTo(other));
                            this.currentAnim.angle = this.angleTo(other);
                            if(this.fireTimer.delta() > this.rateOfFire){
                                console.log("   FIRE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+ this.damage);
                                other.health -= 50;
                                console.log("IT SHOULD BE DEAD NOW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + other.health);

                                //roll attack
                                //game.spawn projectile (here is an image, here is your attack, here is your target
                                //projectile
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
                            this.resetTarget();
                        }
                    }
                    else{
                        console.log("Shit's dead Jim!!!");
                        other.kill();
                        this.resetTarget();
                    }
                }


            }
        },*/

        /**
         *  Resets the tower's target.
         */
        resetTarget: function() {
           // console.log("Name:" + this.name);
            this.lockedOn = false;
            this.target = null;
        }
    });
});
