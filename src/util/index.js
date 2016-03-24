var loop = function(condition, func, callback) {
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (condition()) {
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

module.exports.loop = loop;
