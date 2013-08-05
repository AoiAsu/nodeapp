
var crypto = require('crypto');

/**
 * 文字列をハッシュ化します。
 * @param {String} str
 * @returns {String} ハッシュ
 */
exports.createHash = function(str) {
    var hash =  crypto
        .createHash('md5', 'supersecretkey')
        .update(str)
        .digest('hex');
    return hash;
};
