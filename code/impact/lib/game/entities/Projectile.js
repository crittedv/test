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
            speed: 500000000,
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
            animSheet : new ig.AnimationSheet( 'media/bullet_anim.png', 48, 48 ),
            //collision types
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,

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

                this.vel.x = (Math.cos(this.angle.toRad()-Math.PI/2) * this.speed);
                this.vel.y = (Math.sin(this.angle.toRad()-Math.PI/2) * this.speed);

                this.addAnim( 'moving', 0.1, [0,1]);
                this.currentAnim = this.anims.moving;

             //   this.vel.x = (Math.cos(this.angle.toRad()-Math.PI/2) * this.maxVel.x);
              //  this.vel.y = (Math.sin(this.angle.toRad()-Math.PI/2) * this.maxVel.y);

                //this.addAnim( 'moving', 0.2, [0,1] );
                //rotate the actual angle of the animation sprite
                this.currentAnim.angle = this.angle.toRad();

            },

            update: function () {

                this.currentAnim.angle = this.angleTo( this.target );
                var vector = this.tower.vectorTo(this.target);
                this.vel.x = vector.x * this.speed;
                this.vel.y = vector.y * this.speed;

               // console.log("distance to " + this.target + ": " + this.distanceTo(this.target));

                if(this.target.isDead()){


                    //THIS NEEDS TO BE KILLED AFTER  TRAVELING X RANGE?
                   // this.kill();
                }this.parent();
            },

            check: function(other){
                this.parent();
               // console.log("RANGE CHECK: within 10?");
                if(other instanceof EntityEnemy){

                   // console.log("Locked on to Target:" + this.target);

                    if(other === this.target){
                        other.receiveDamage(this.damage,this);
                        //this.kill();
                    }
                    //console.log("Testing");

/*
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

*/

                }
            }



        });
   /*
            createBody: function () {
                var bodyDef = new b2.BodyDef();
                bodyDef.position.Set((this.pos.x + this.size.x / 2) * b2.SCALE, (this.pos.y + this.size.y / 2) * b2.SCALE);
                this.body = ig.world.CreateBody(bodyDef);
                var shapeDef = new b2.PolygonDef();
                shapeDef.SetAsBox(1, 1);
                shapeDef.density = .01;
                shapeDef.restitution = 0;
                shapeDef.friction = 0;
                shapeDef.filter.maskBits = 0x0000;
                shapeDef.filter.categoryBits = 0x0002;
                shapeDef.filter.groupIndex = -2;
                this.body.CreateShape(shapeDef);
                this.body.SetMassFromShapes();
            },

            collision: function () {
                for (var edge = this.body.m_contactList; edge; edge = edge.next) {
                    var normal = edge.contact.m_manifold.normal;
                    var x = this.pos.x + normal.x.map(1, -1, 0, 1) * this.size.x;
                    var y = this.pos.y + normal.y.map(1, -1, 0, 1) * this.size.y;
                    var point = {
                        x: x,
                        y: y
                    };
                    var ent = edge.other.entity;
                    if (! (ent === null)) {
                        var f1 = this.shape.m_filter,
                            f2 = ent.shape.m_filter;
                        if (f2.groupIndex > 0 || f1.categoryBits == f2.maskBits) {
                            this.collideEntity(ent, point, normal);
                        }
                    }
                    this.kill();
                    break;
                }
            },

            collideEntity: function (other, point, normal) {
                if (other.__proto__.__proto__.name != "bullet") {
                    other.hp -= this.damage;
                    if (!ig.game.getEntityByName("fog").isPositionFogged(other.pos.x, other.pos.y)) {
                        ig.game.spawnEntity(EntityZombieBlood, other.pos.x, other.pos.y);
                    }
                } else {}
            },

            draw: function () {
                var ctx = ig.system.context;
                ctx.fillStyle = 'rgba(0,0,0,1)';
                ctx.beginPath();
                ctx.rect(this.pos.x, this.pos.y, this.radius, this.radius);
                ctx.closePath();
                ctx.fill();
            }
        });

        EntityTowerBullet = EntityProjectile.extend({
            name: 'towerBullet',
            target: null,
            radius: 3
        });
 /*       EntityShotgunBlast = EntityProjectile.extend({
            name: 'shotgunblast',
            target: null,
            radius: 3
        });
        EntityRifleRound = EntityProjectile.extend({
            name: 'rifleround',
            target: null,
            radius: 3
        });*/

});
