var SafeStreamHttpClient = require('./http').SafeStreamHttpClient;
var VideoAPI = require('./video').VideoAPI;
var WatermarkAPI = require('./watermarking').WatermarkAPI;

var SafeStreamAPI = function(apiKey, options) {
    var safeStreamHttpClient = new SafeStreamHttpClient(apiKey, options ? options.httpClientOptions : { });
    this.video = new VideoAPI(safeStreamHttpClient);
    this.watermark = new WatermarkAPI(safeStreamHttpClient);
}

module.exports = SafeStreamAPI;
