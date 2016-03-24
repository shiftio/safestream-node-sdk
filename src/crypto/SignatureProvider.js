/**
 * The SignatureProvider is responsible for creating HMAC signatures
 */
var path = require('path');
var url = require('url');
var crypto = require("crypto");

var SignatureProvider = function () {

}

SignatureProvider.prototype.sign = function(text, key) {
    return this.createSignature(text, key);
}
/**
 * Creates an HMAC signature for a given URL
 * @method function
 * @param  string urlToSign
 * @param  string expiration Number of millis before the URL is expired
 * @return string            The URL with HMAC signature
 */
SignatureProvider.prototype.signUrl = function(urlToSign, expiration, key, body) {
    var urlObject = url.parse(urlToSign, true, false);

    // "query (object; see querystring) will only be used if search is absent" from:
    // https://nodejs.org/api/url.html#url_url_format_urlobj
    delete urlObject.search;

    // We add an expiration before signing the URL so that we can both create
    // a unique signature and expire the URL
    urlObject.query['expiration'] = expiration || new Date().getTime() + 43200; // Default to expire in 12 hours

    var signature = this.sign(url.format(urlObject) + (body || ""), key);
    urlObject.query['signature'] = signature;
    return url.format(urlObject);
}

/**
 * Asserts that the signature on a given HMA signed URL is valid
 * @method function
 * @param  string urlToVerify The HMAC signed URL
 * @return void				  Throws AuthenticationError is the signature is invalid
 */
SignatureProvider.prototype.verifySignedUrl = function(urlToVerify, key, body) {
    var urlObject = url.parse(urlToVerify, true, false);

    // If the URL is expired don't bother verifying the signature
    if(!urlObject.query['expiration'] || urlObject.query['expiration'] < new Date().getTime()) {
        throw new AuthenticationError("Signature expired");
    }

    // Remove the signature so that we can try to recreate the unsigned URL.
    // We'll use the unsigned URL to recreate a signature for comparison
    var signature = urlObject.query['signature'];
    delete urlObject.query.signature;
    delete urlObject.search;
    var unsignedUrl = url.format(urlObject);

    if(!this.isValidSignature(signature, unsignedUrl + (body || ""), key)) {
        throw new AuthenticationError("Invalid signature")
    }
}

SignatureProvider.prototype.createSignature = function(body, key) {
    var sig = crypto.createHmac("sha256", key || path.resolve(__dirname + '/keys/safestream.pem')).update(body).digest("hex");

    return sig;
}

SignatureProvider.prototype.isValidSignature = function(signature, body, key) {
    var computedSignature = this.createSignature(body, key || path.resolve(__dirname + '/keys/safestream.pem'));
    return computedSignature === signature;
}

module.exports = SignatureProvider;
