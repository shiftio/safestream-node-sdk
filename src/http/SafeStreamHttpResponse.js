
var SafeStreamHttpResponse = function (httpStatus, body) {
    this.httpStatus = httpStatus;
    this.body = body;
}

SafeStreamHttpResponse.prototype.getEntity = function() {
    return JSON.parse(this.body);
}

SafeStreamHttpResponse.prototype.setHttpStatus = function(httpStatus) {
    this.httpStatus = httpStatus;
}

SafeStreamHttpResponse.prototype.setBody = function(body) {
    this.body = body;
}

SafeStreamHttpResponse.prototype.getHttpStatus = function() {
    return this.httpStatus;
}

SafeStreamHttpResponse.prototype.getBody = function() {
    return this.body;
}

module.exports = SafeStreamHttpResponse;

