ig.module(
    'game.entities.Enemy'
)
.requires(
    'impact.entity',
    'game.ui.decorations.BarMeter'
)
.defines(function(){

    EntityEnemy = ig.Entity.extend({

        coord      : null,

        zIndex: 10,
        size: {x:64, y:64},

        defense: null,
        bounceSign : -1,
        speed: 100,
        name: null,
        maxHealth : 0,
        health    : 0,
        healthMeterUi : null,
        healthMeterYOffset : -1,

        type: ig.Entity.TYPE.B,
        visitedWaypoints : {},
        waypoint         : null,

        animSheet : new ig.AnimationSheet( 'media/tmp/devonHeads.png', 64, 64 ),

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

        visitWaypoint : function(waypoint) {
            console.log("VISITING" + waypoint.name);
            if(!TypeUtil.hasProp(this.visitedWaypoints, waypoint.name)) {
                this.setWaypoint(waypoint.next);
                this.bounceSign *= -1;
                this.currentAnim = this.anims.moving;
                this.visitedWaypoints[waypoint.name] = waypoint;
            }
        },

        visitExit : function(exit) {
            this.kill();
        },

        setWaypoint : function(waypointName) {
            if(TypeUtil.isDefined(waypointName)) {
                this.waypoint = ig.game.getEntityByName(waypointName);
                this.getPath(this.waypoint.pos.x, this.waypoint.pos.y, false, [/*'EntityEnemy'*/]);
                this.followPath(this.speed, true);
            } else {
                this.vel.x = 0;
                this.vel.y = 0;
            }
        },

        init: function( x, y, settings ) {
            this.parent( x,y, settings );
            this.health    = 100;
            this.maxHealth = 100;
            this.defense = settings.defense;
            this.addAnim( 'idle', 0.1, [0,1,2,1,0] );
            this.addAnim( 'moving', 0.1, [0,1,2,3,4,5,4,3,2,1]);
            this.addAnim( 'death', 0.1, [10,11,12,13,13,13], true);
            this.healthMeterUi = new BarMeter( this.getHealthMeterSettings() );
            if(TypeUtil.isDefined(settings.waypoint)) {
                this.setWaypoint(settings.waypoint);
            }
        },

        update: function() {

            if(this.isDead()) {
                this.kill();
            }

            this.healthMeterUi.pos.x = this.getHealthMeterX();
            this.healthMeterUi.pos.y = this.getHealthMeterY();
            this.healthMeterUi.setPerc(this.getPercHealth());
            this.parent();

            if(!TypeUtil.isEmpty(this.waypoint)) {
                this.followPath(this.speed, true);
            }
        },

        kill : function() {
            this.parent();
            this.spawnDeath();
        },

        getDeathSettings : function() {
            var size = this.size;
            return {
                animSheet : this.animSheet,
                deathAnim : {name : 'death', frameTime : 0.1, sequence : [10,11,12,13,13,13]},
                size      : size
            };
        },

        spawnDeath: function() {
            ig.game.spawnEntity(EntityDeath, this.pos.x, this.pos.y, this.getDeathSettings());
        },

        getHealthMeterSettings : function() {
            var hmSettings = { pos : {}, size : {}};
            hmSettings.pos.x  = this.getHealthMeterX();
            hmSettings.pos.y  = this.getHealthMeterY();
            hmSettings.size.x = this.getHealthMeterWidth();
            hmSettings.size.y = this.getHealthMeterHeight();
            hmSettings.horizontal = true;
            hmSettings.color       = 'red';
            hmSettings.borderColor = '#666666';
            hmSettings.insetColor  = '#444444';
            hmSettings.percentage  = 1;
            return hmSettings;
        },
        getHealthMeterX     : function() {return this.pos.x },
        getHealthMeterWidth : function() {return this.size.x},

        getHealthMeterY      : function() {return this.pos.y + this.size.y + this.healthMeterYOffset},
        getHealthMeterHeight : function() {return 5},

        draw : function() {
            this.parent();
            this.healthMeterUi.draw();
        }
    });

});
