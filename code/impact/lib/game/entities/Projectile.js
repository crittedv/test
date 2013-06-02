ig.module(
    'game.entities.Projectile'
)
.requires(
    'impact.entity'
)
.defines(function () {

        EntityProjectile = ig.Entity.extend({
            name: 'bullet',
            target: null,

            speed: 200,
            damage: 10,
            radius: 1,
            range: 100,
            angle: null,
            flip: false, //WTF is flip?
            zIndex: 10,
            level: 1,
            upgradeCoefficient: 1,
            isDead: false,
            utils: null,
            size : {x: 16, y: 16},
            animSheet : new ig.AnimationSheet( 'media/bullet_anim_small.png', 16, 16 ),
            //collision types
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.NEVER,
            fuel: 2,
            currentFuel: null,

            init: function (x, y, settings) {

                this.parent(x, y, settings);
                this.target = settings.target;
                this.flip = settings.flip;
                this.angle = settings.angle.toRad();
            //    this.damage = settings.damage;
            //    this.tower = settings.damage;
            //    this.size.x = this.radius;
             //   this.size.y = this.radius;
                //this.angleTo(this.target);

                //this.vel.x *= this.speed;
                //this.vel.y *= this.speed;
                this.maxVel.x = 200;
                this.maxVel.y = 200;



             //   this.vel.x = (Math.cos(this.angle.toRad()-Math.PI/2) * this.speed);
             //   this.vel.y = (Math.sin(this.angle.toRad()-Math.PI/2) * this.speed);
                this.vel.x = (Math.cos(this.angle.toRad()-Math.PI/2) * this.maxVel.x);
                this.vel.y = (Math.sin(this.angle.toRad()-Math.PI/2) * this.maxVel.y);
                this.addAnim( 'moving', 0.4, [0,1]);
                this.currentAnim = this.anims.moving;


                //this.addAnim( 'moving', 0.2, [0,1] );
                //rotate the actual angle of the animation sprite
                this.currentAnim.angle = this.angleTo(this.target);
                this.currentFuel =  new ig.Timer(this.fuel);
            },

            /**
             * This overrides the default handleMovementTrace() to ignore collisions with walls
             * @param res
             */
            handleMovementTrace: function(res) {
                this.pos.x += this.vel.x * ig.system.tick;
                this.pos.y += this.vel.y * ig.system.tick;
            },

            update: function () {
                var vector = this.vectorTo(this.target);
                this.vel.x = vector.x * this.speed;
                this.vel.y = vector.y * this.speed;
               // console.log("distance to " + this.target + ": " + this.distanceTo(this.target));

                if(this.target.isDead() || this.target == undefined || this.target == null || (this.currentFuel.delta() >= this.fuel)){


                    //THIS NEEDS TO BE KILLED AFTER  TRAVELING X RANGE?
                    this.kill();
                }


                this.parent();
            },

            check: function(other){
                //console.log("WTF: " + other.name);
                this.parent();
               // console.log("RANGE CHECK: within 10?");
                if(other instanceof EntityEnemy){

                   // console.log("Locked on to Target:" + this.target);

                    if(other === this.target){
                        other.receiveDamage(this.damage,this);
                        this.kill();
                    }

                }
            }
        });

});
