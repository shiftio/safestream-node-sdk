var SignatureProvider       = require('../crypto').SignatureProvider;
var SafeStreamHttpResponse  = require('./SafeStreamHttpResponse');
var url                     = require('url');
var util                    = require('util');
var querystring             = require('querystring');
var http                    = require('https');

var SafeStreamHttpClient = function (apiKey, options) {

    this.protocol   = 'https';
    this.port       = 80;
    this.hostName   = 'api.safestream.com';
    this.apiVersion = '0.1';
    this.apiKey     = apiKey;

    this.authToken;
    this.clientCryptoKey;
    this.signatureExpiration = 30000;

    if (options) {
        if(options.protocol && ['http', 'https'].indexOf(options.protocol.toLowerCase()) > -1) {
            this.protocol = options.protocol.toLowerCase();
            http = options.protocol === 'http' ? require('http') : require('https');
        }

        if(options.port) {
            this.port = options.port;
        }

        if(options.hostName) {
            this.hostName = options.hostName.toLowerCase();
        }

        if(options.apiVersion) {
            this.apiVersion = options.apiVersion.toLowerCase();
        }

        if(options.clientCryptoKey) {
            this.clientCryptoKey = options.clientCryptoKey;

            if(options.signatureExpiration) {
                this.signatureExpiration = options.signatureExpiration;
            }
        }
    }
}

SafeStreamHttpClient.prototype.request = function(args, callback) {
    var self = this;
    self.getAuthToken(function(err, token) {
        if (err) {
            callback(err, null);
        } else {
            var path;
            if(self.clientCryptoKey) {
                var f = new Date().getTime() + self.signatureExpiration;
                var g = new Date().getTime();
                var urlToSign = self.protocol + '://' + self.hostName + (self.port == 80 ? '' : ':' + self.port) + '/' + args.resource;
                var signedUrl = new SignatureProvider().signUrl(urlToSign, new Date().getTime() + self.signatureExpiration, self.clientCryptoKey, JSON.stringify(args.body));
                path = url.parse(signedUrl).path.substr(1);
            }

            var req = http.request(self.getDefaultRequestOptions({
                path: path || args.resource,
                method: args.method,
                token: token,
                body: args.body
            }), function (res) {
                var response = new SafeStreamHttpResponse(res.statusCode);

                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    response.setBody(chunk);

                    if (response.getHttpStatus() >= 400) {
                        callback(response, null);
                    } else {
                        self.authToken = response.getEntity().token;
                        callback(null, response);
                    }
                });
            });


            if (args.body && ['POST', 'PUT'].indexOf(args.method.toUpperCase()) > -1) {
                if (typeof args.body === 'string') {
                    req.write(args.body);
                } else {
                    req.write(JSON.stringify(args.body));
                }
            }

            req.end();
        }
    });
}

SafeStreamHttpClient.prototype.get = function(resource, callback) {
    this.request({ resource: resource, method: 'GET' }, callback);
}

SafeStreamHttpClient.prototype.post = function(resource, body, callback) {
    this.request({ resource: resource, method: 'POST', body: body }, callback);
}

SafeStreamHttpClient.prototype.getAuthToken = function(callback) {
    var self = this;
    if(!self.authToken) {
        var req = http.request(self.getDefaultRequestOptions({ path: 'token', method: 'POST', 'x-api-key': self.apiKey }), function(res) {
            var response = new SafeStreamHttpResponse(res.statusCode);

            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                response.setBody(chunk);

                if(response.getHttpStatus() >= 400) {
                    callback(response, null);
                } else {
                    self.authToken = response.getEntity().token;
                    callback(null, self.authToken);
                }
            });
        });

        req.end();
    } else {
        callback(null, self.authToken);
    }
}

SafeStreamHttpClient.prototype.getDefaultRequestOptions = function(options) {
    var requestOptions = {
        host: this.hostName,
        port: this.port,
        path: '/' + options.path,
        method: options.method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if(options['token']) {
        requestOptions.headers['Authorization'] = 'Bearer ' + options['token'];
    } else if(options['x-api-key']) {
        requestOptions.headers['x-api-key'] = options['x-api-key'];
    }

    if(options.body) {
        if(typeof body === 'string') {
            requestOptions.headers['Content-Length'] = options.body.length;
        } else {
            requestOptions.headers['Content-Length'] = JSON.stringify(options.body).length;
        }
    }

    return requestOptions;
}

module.exports = SafeStreamHttpClient;

