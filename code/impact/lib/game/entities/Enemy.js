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
        size: {x:32, y:32},

        dying : false,
        defense: null,
        bounceSign : -1,
        speed: 40,
        name: null,
        maxHealth : 0,
        health    : 0,
        healthMeterUi : null,
        deathTimer : null,

        type: ig.Entity.TYPE.B,
        visitedWaypoints : {},
        waypoint         : null,

        animSheet : new ig.AnimationSheet( 'media/tmp/devonHeads.png', 40, 40 ),

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
            if(!TypeUtil.hasProp(this.visitedWaypoints, waypoint.name)) {
                console.log("Enemy visited waypoint: " + waypoint.name);
                this.setWaypoint(waypoint.next);
                this.bounceSign *= -1;
                this.currentAnim = this.anims.moving;
                this.visitedWaypoints[waypoint.name] = waypoint;
            }
        },

        visitExit : function(exit) {
            console.log("Creature escaped");
            this.showDeath();
        },

        setWaypoint : function(waypointName) {
            if(TypeUtil.isDefined(waypointName)) {
                this.waypoint = ig.game.getEntityByName(waypointName);
                var vector = this.vectorTo(this.waypoint);
                this.vel.x = vector.x * this.speed;
                this.vel.y = vector.y * this.speed;
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
            this.addAnim( 'death', 0.1, [10,11,12,13,13,13]);
            this.healthMeterUi = new BarMeter( this.getHealthMeterSettings() );
            if(TypeUtil.isDefined(settings.waypoint)) {
                this.setWaypoint(settings.waypoint);
            }
        },

        update: function() {
            this.healthMeterUi.pos.x = this.getHealthMeterX();
            this.healthMeterUi.pos.y = this.getHealthMeterY();
            this.healthMeterUi.setPerc(this.getPercHealth());
            this.parent();

            if(this.deathTimer != null) {
                if(this.deathTimer.delta() >= 0) {
                    console.log("KILL");
                    this.kill();
                }
            }
        },

        kill: function() {
            this.showDeath();
            this.parent();
        },

        showDeath: function() {
            this.dying = true;
            this.deathTimer = new ig.Timer(.02);
            this.currentAnim = this.anims.death;
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

        getHealthMeterY      : function() {return this.pos.y + this.size.y + 5},
        getHealthMeterHeight : function() {return 5},

        draw : function() {
            this.parent();
            this.healthMeterUi.draw();
        }
    });

});
