var url = require('url');
var util = require('../util');
var EncodingConfiguration = require('./encoding').EncodingConfiguration;
var WatermarkConfiguration = require('./WatermarkConfiguration');

var WatermarkAPI = function (safeStreamHttpClient) {
    this.apiResourcePath = "watermark";
    this.safeStreamHttpClient = safeStreamHttpClient;
}

WatermarkAPI.prototype.get = function(key, configuration, callback) {
    // Creating a watermark is idempotent.
    // So getting a watermark is the same as creating a watermark that has already been created.
    this.create(key, configuration, callback);
}

WatermarkAPI.prototype.create = function(key, configuration, callback) {
    if(configuration instanceof EncodingConfiguration) {
        this.createFromEncodingConfiguration(key, configuration, callback);
    } else if(configuration instanceof WatermarkConfiguration) {
        this.createFromWatermarkConfiguration(key, configuration, callback);
    } else if(configuration instanceof Array) {
        if(configuration.length > 0) {
            if(configuration[0] instanceof WatermarkConfiguration) {
                this.createFromWatermarkConfigurations(key, configuration, callback);
            } else {
                callback({ message: "Invalid watermark configuration" });
            }
        }
    }

}

WatermarkAPI.prototype.createFromWatermarkConfiguration = function(key, watermarkConfiguration, callback) {
    this.createFromEncodingConfiguration(key, new EncodingConfiguration({ watermarks: [watermarkConfiguration] }), callback);
}

WatermarkAPI.prototype.createFromWatermarkConfigurations = function(key, watermarkConfigurations, callback) {
    this.createFromEncodingConfiguration(key, new EncodingConfiguration({ watermarks: watermarkConfigurations }), callback);
}

WatermarkAPI.prototype.createFromEncodingConfiguration = function(key, encodingConfiguration, callback) {
    var self = this;
    self.safeStreamHttpClient.post(self.apiResourcePath, { key: key, settings: encodingConfiguration.watermarks }, function(err, data) {
        if(err) {
            callback(err);
        } else {
            var watermarkResult = data.getEntity();
            var watermarkStatusResponse;
            var timeout = 90000;
            var startTime = new Date().getTime();

            util.loop(
                function() { return (new Date().getTime() - startTime) < timeout; },
                function(loop) {
                    var parsedUrl = url.parse(watermarkResult.href);
                    var http = parsedUrl.protocol.toLowerCase() === 'http:' ? require('http') : require('https');
                    var req = http.request({
                        host: parsedUrl.hostName,
                        port: parsedUrl.port,
                        path: parsedUrl.path,
                        method: 'GET'
                    }, function (res) {
                        if(res.statusCode >= 400) {
                            callback({ message: "Could not get watermark status after invoking watermark job" });
                            loop.break();
                        }

                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            watermarkStatusResponse = JSON.parse(chunk);

                            if("READY" === watermarkStatusResponse.status) {
                                loop.break();
                            } else {
                                // Okay, for cycle could continue. But let's slow things down so we don;t make too many unnecessary requests
                                setTimeout(
                                    function() {
                                        loop.next();
                                    }, 5000
                                )
                            }
                        });
                    });

                    req.end();
                },
                function() {
                    if("READY" === watermarkStatusResponse.status) {
                        callback(null, watermarkStatusResponse);
                    } else {
                        callback({message: "Timeout reached waiting for video to be ingested. Videos ingest takes about as long as the video duration itself."});
                    }
                }
            );
        }
    });
}

module.exports = WatermarkAPI;


