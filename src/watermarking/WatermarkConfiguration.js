
var WatermarkConfiguration = function(options) {
    if(options) {
        if(options.content) {
            this.content = options.content;
        }

        if(options.type) {
            this.content = options.content;
        }

        if(options.x) {
            this.content = options.content;
        }

        if(options.y) {
            this.content = options.content;
        }

        if(options.fontSize) {
            this.content = options.content;
        }

        if(options.fontOpacity) {
            this.content = options.content;
        }

        if(options.fontColor) {
            this.content = options.content;
        }

        if(options.shadowOpacity) {
            this.content = options.content;
        }

        if(options.shadowColor) {
            this.content = options.content;
        }
        if(options.shadowOffsetX) {
            this.content = options.content;
        }

        if(options.shadowOffsetY) {
            this.content = options.content;
        }

        if(options.horizontalAlignment) {
            this.content = options.content;
        }

        if(options.verticalAlignment) {
            this.content = options.content;
        }
    }
}

/**
 * The text string to watermark onto the video
 *
 * Fluent setter for content
 */
WatermarkConfiguration.prototype.withContent = function(content) {
    this.content = content;
    return this;
}

/**
 * Currently TEXT is supported.
 *
 * Fluent setter for type
 */
WatermarkConfiguration.prototype.withType = function(type) {
    this.type = type;
    return this;
}

/**
 * The relative x position of the anchor. The position is relative to the width of the video. So, a video with a width of 1080 and an x value of .5 will
 * put the anchor point at 540 pixels. The anchor position is defined by the horizontal and vertical alignment.
 *
 * Fluent setter for x
 */
WatermarkConfiguration.prototype.withX = function(x) {
    this.x = x;
    return this;
}

/**
 * The relative y position of the anchor. The position is relative to the height of the video. So, a video with a height of 720 and an y value of .5 will
 * put the anchor point at 360 pixels. The anchor position is defined by the horizontal and vertical alignment.
 *
 * Fluent setter for y
 */
WatermarkConfiguration.prototype.withY = function(y) {
    this.y = y;
    return this;
}

/**
 * Size of the watermark text relative to the height of the video. For example, a video with a height of 720 and a font size of .05 will produce a
 * watermark with a text font size of 36
 *
 * Fluent setter for fontSize
 */
WatermarkConfiguration.prototype.withFontSize = function(fontSize) {
    this.fontSize = fontSize;
    return this;
}

/**
 * Values from 0 (totally transparent) to 1 (totally opaque)
 *
 * Fluent setter for fontOpacity
 */
WatermarkConfiguration.prototype.withFontOpacity = function(fontOpacity) {
    this.fontOpacity = fontOpacity;
    return this;
}

/**
 * Hex value of font color (ex 0xffffff)
 *
 * Fluent setter for fontColor
 */
WatermarkConfiguration.prototype.withFontColor = function(fontColor) {
    this.fontColor = fontColor;
    return this;
}

/**
 * Opacity of the drop shadow of the watermark text. 0 (totally transparent) to 1 (totally opaque)
 *
 * Fluent setter for shadowOpacity
 */
WatermarkConfiguration.prototype.withShadowOpacity = function(shadowOpacity) {
    this.shadowOpacity = shadowOpacity;
    return this;
}

/**
 * Hex value of watermark text drop shadow color (ex 0xffffff)
 *
 * Fluent setter for shadowColor
 */
WatermarkConfiguration.prototype.withShadowColor = function(shadowColor) {
    this.shadowColor = shadowColor;
    return this;
}

/**
 * Fluent setter for shadowOffsetX
 */
WatermarkConfiguration.prototype.withShadowOffsetX = function(shadowOffsetX) {
    this.shadowOffsetX = shadowOffsetX;
    return this;
}

/**
 * Fluent setter for shadowOffsetY
 */
WatermarkConfiguration.prototype.withShadowOffsetY = function(shadowOffsetY) {
    this.shadowOffsetY = shadowOffsetY;
    return this;
}

/**
 * Specifies the horizontal anchor point on the watermark.
 *
 * A value of LEFT will anchor the watermark on it's right most point
 * A value of RIGHT will anchor the watermark on it's left most pixel
 * A value of CENTER will anchor the watermark in it's center most pixel
 *
 * Fluent setter for horizontalAlignment
 */
WatermarkConfiguration.prototype.withHorizontalAlignment = function(horizontalAlignment) {
    this.horizontalAlignment = horizontalAlignment;
    return this;
}

/**
 * Specifies the vertical anchor point on the watermark.
 *
 * A value of TOP will anchor the watermark on it's top most point
 * A value of MIDDLE will anchor the watermark on it's middle most pixel
 * A value of BOTTOM will anchor the watermark in it's bottom most pixel
 *
 * Fluent setter for verticalAlignment
 */
WatermarkConfiguration.prototype.withVerticalAlignment = function(verticalAlignment) {
    this.verticalAlignment = verticalAlignment;
    return this;
}

module.exports = WatermarkConfiguration;
