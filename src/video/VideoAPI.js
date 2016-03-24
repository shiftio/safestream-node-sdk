var util = require('../util');

var VideoAPI = function (safeStreamHttpClient) {
    this.apiResourcePath = "videos";
    this.safeStreamHttpClient = safeStreamHttpClient;
}

VideoAPI.prototype.find = function(key, callback) {
    var self = this;

    self.safeStreamHttpClient.get(self.apiResourcePath + "?key=" + key, function(err, data) {
        if(err) {
            callback(err);
        } else {
            if(data && data.getEntity() && data.getEntity() instanceof Array) {
                callback(null, data.getEntity()[0]);
            } else {
                callback({ message: "Bad response from video endpoint" });
            }
        }
    })
}

VideoAPI.prototype.create = function(video, callback) {
    this.createSync(video, 0, callback);
}

VideoAPI.prototype.createSync = function(video, timeout, callback) {
    var self = this;

    self.safeStreamHttpClient.post(self.apiResourcePath, video, function(err, data) {
        if(err) {
            callback(err);
        } else {
            var video = data.getEntity();
            if(timeout) {
                var startTime = new Date().getTime();
                var error;
                util.loop(
                    function() { return (new Date().getTime() - startTime) < timeout; },
                    function(loop) {

                        self.find(video.key, function(err, videoTestData) {
                            // log the iteration
                            //console.log(loop.iteration());

                            if(err) {
                                error = err;
                                loop.break();
                            } else {
                                video = videoTestData;

                                if("INGESTED" === video.status) {
                                    loop.break();
                                } else {
                                    // Okay, for cycle could continue. But let's slow things down so we don;t make too many unnecessary requests
                                    setTimeout(
                                        function() {
                                            loop.next();
                                        }, 5000
                                    )
                                }
                            }
                        })},
                    function(){
                        if(error) {
                            callback(error)
                        } else {
                            if("INGESTED" === video.status) {
                                callback(null, video);
                            } else {
                                callback({ message: "Timeout reached waiting for video to be ingested. Videos ingest takes about as long as the video duration itself." });
                            }
                        }
                    }
                );
            } else {
                callback(null, video);
            }

        }
    })
}

module.exports = VideoAPI;
