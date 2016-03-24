
var EncodingConfiguration = function(options) {

    if(options) {
        if(options.saturation) {
            this.saturation = options.saturation;
        }

        if(options.resolution) {
            this.resolution = options.resolution;
        }

        if(options.bitRate) {
            this.bitRate = options.bitRate;
        }

        if(options.watermarks) {
            this.watermarks = options.watermarks;
        }
    }

}

/**
 * The level of saturation to be applied to the output
 *
 * Valid values are from 0 to 1
 *
 * Fluent setter for saturation
 */
EncodingConfiguration.prototype.withSaturation = function(saturation) {
    this.saturation = saturation;
    return this;
}

/**
 * The target video resolution.
 *
 * Fluent setter for resolution
 */
EncodingConfiguration.prototype.withResoluation = function(resolution) {
    this.resolution = resolution;
    return this;
}

/**
 * The video bit rate in kilobits per second. For example, to create 4 Mb video the value would be 4000k
 *
 * Fluent setter for bitRate
 */
EncodingConfiguration.prototype.withBitRate = function(bitRate) {
    this.bitRate = bitRate;
    return this;
}

/**
 * One or more watermarks that should be burned into the video
 *
 * Fluent setter for watermark configurations
 */
EncodingConfiguration.prototype.withWatermark = function(watermarkConfiguration) {
    if(this.watermarks == null) {
        this.watermarks = [watermarkConfiguration]
    } else {

    }

    this.watermarks.push(watermarkConfiguration);

    return this;
}

module.exports = EncodingConfiguration;
