ig.module(
    'game.ui.decorations.BarMeter'
)
.requires(
    'impact.entity'
).defines(function(){
    BarMeter = ig.Class.extend({

        pos  : {x:0, y:0},
        size : {x:0, y:0},

        percentage: .1,
        horizontal: false,
        color : 'blue',
        borderColor  : null,
        insetColor : null,

        setPerc : function(perc) {
            this.percentage = perc;
        },

        setPercentage : function(value, limit) {
            this.percentage = (value / limit);
        },

        init: function( settings ) {
            this.pos.x  = settings.pos.x;
            this.pos.y  = settings.pos.y;
            this.size.x = settings.size.x;
            this.size.y = settings.size.y;
            this.horizontal  = settings.horizontal;
            this.color       = settings.color;
            this.percentage  = settings.percentage;
            this.borderColor = settings.borderColor;
            this.insetColor  = settings.insetColor;
        },

        draw: function() {
            var perc = this.percentage;
            var context = ig.system.context;

            var drawWidth  = this.size.x;
            var drawHeight = this.size.y;
            var drawX = 0;
            var drawY = 0;

            if(this.horizontal) {
                drawWidth = Math.round( this.size.x * perc );
                drawX = ig.system.getDrawPos( this.pos.x );
                drawY = ig.system.getDrawPos( this.pos.y );
            } else {
                drawHeight = Math.round( this.size.y * perc );
                drawX = ig.system.getDrawPos( this.pos.x );
                drawY = ig.system.getDrawPos( this.size.x - this.pos.y - drawHeight);
            }

            context.fillStyle = this.color;

            if(! TypeUtil.isEmpty(this.borderColor) ) {
                var offset = Math.min(Math.floor(this.size.x * 0.05) + 1, Math.floor(this.size.y * 0.05) + 1);
                var twoXOffset = offset + offset;
                var bdDrawX = drawX - offset;
                var bdDrawY = drawY - offset;
                var bdDrawWidth  = this.size.x   + twoXOffset;
                var bdDrawHeight = this.size.y  + twoXOffset;
                context.fillStyle = this.borderColor;
                context.fillRect(bdDrawX, bdDrawY, bdDrawWidth, bdDrawHeight);
            }

            if(! TypeUtil.isEmpty(this.insetColor) ) {
                context.fillStyle = this.insetColor;
                context.fillRect(drawX, drawY, this.size.x, this.size.y);
            }

            context.fillStyle = this.color;
            context.fillRect(drawX, drawY, drawWidth, drawHeight);
        }
    });
});