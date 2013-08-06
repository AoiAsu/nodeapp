/**
 * @fileOverview UserService
 * @file user.js
 * @author Asuki Takamine <takamine_asuki@cyberagent.co.jp>
 */
var database = require('../mongo/database');
var util = require('../util');
var mongo = require('../mongo');

var userMongo = mongo.get('User');

function UserService() {
}

module.exports = new UserService();

UserService.prototype.get = function(id, callback) {
    if (!id) {
        return callback(new Error());
    }

    userMongo.get({ _id: id }, {}, callback);
};

/**
 * ユーザーを登録します。
 * @param {Object} user
 * @param {Function} callback
 */
UserService.prototype.register = function(user, callback) {
    var hash = util.createHash(user.pwd);

    var data = {
        _id: user.userId,
        pwd: hash
    };

    userMongo.insert(data, callback);
};