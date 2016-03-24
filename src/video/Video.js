
var Video = function(options) {
    if(options) {
        if(options.sourceUrl) {
            this.sourceUrl = options.sourceUrl;
        }
    }
}

/**
 * Fluent setter for the property key
 *
 * This can be an external key of any string value. If no value is given when the video is created then the key will be the source URL.
 */
Video.prototype.withKey = function(key) {
    this.key = key;
    return this;
}

/**
 * Fluent setter for the property name
 *
 * An optional descriptive name for a video
 */
Video.prototype.withName = function(name) {
    this.name = name;
    return this;
}

/**
 * Fluent setter for the property sourceUrl
 *
 * The URL where the video source exists at the time of creating this video. Currently, http and https URLs are supported
 */
Video.prototype.withSourceUrl = function(sourceUrl) {
    this.sourceUrl = sourceUrl;
    return this;
}

/**
 * Fluent setter for the property tags
 *
 * Tags identify and characterize this video
 */
Video.prototype.withTag = function(tag) {
    if (this.tags == null) {
        this.tags = [tag];
    } else {
        this.tags.push(tag);
    }

    return this;
}

/**
 * Fluent setter for the property tags
 *
 * Tags identify and characterize this video
 */
Video.prototype.withTags = function(tags) {
    this.tags = tags;
    return this;
}

/**
 * Fluent setter for the property allowHmacAuth
 *
 * If we should use signed URLs for access tto he watermarked segments and M3U8 of this videos watermarked versions
 */
Video.prototype.withHMACAuth = function() {
    this.allowHmacAuth = true;
    return this;
}

/**
 * Fluent setter for the property allowHmacAuth
 *
 * If we should use signed URLs for access tto he watermarked segments and M3U8 of this videos watermarked versions
 */
Video.prototype.withoutHMACAuth = function() {
    this.allowHmacAuth = false;
    return this;
}

/**
 * Fluent setter for the property encrypt
 *
 * If we should encrypt the watermarked segments of this video at rest
 */
Video.prototype.withEncryption = function() {
    this.encrypt = true;
    return this;
}

/**
 * Fluent setter for the property encrypt
 *
 * If we should encrypt the watermarked segments of this video at rest
 */
Video.prototype.withoutEncryption = function() {
    this.encrypt = false;
    return this;
}

/**
 * Fluent setter for the property proxies
 *
 * The unwatermarked HLS proxies for this video.
 */
Video.prototype.withExistingProxy = function(segmentedProxy) {
    if(this.proxies == null) {
        this.proxies = [segmentedProxy];
    } else {
        this.proxies.push(segmentedProxy);
    }

    return this;
}

/**
 * Fluent setter for the property config
 *
 * An optional configuration that overrides default account configurations and system configurations for storing this video and it's watermarked proxies
 */
Video.prototype.withConfig = function(config) {
    this.config = config;

    return this;
}

Video.prototype.toJson = function() {
    var copy = { };
    for (var attrname in this) {
        if(this.hasOwnProperty(attrname)) {
            copy[attrname] = this[attrname];
        }
    }

    return JSON.stringify(copy);
}

module.exports = Video;
