/**
 * @fileOverview UserService
 * @file user.js
 * @author Asuki Takamine <takamine_asuki@cyberagent.co.jp>
 */
var database = require('../database');
var util = require('../util');

function UserService() {
}

module.exports = new UserService();

UserService.prototype.get = function(id, callback) {
    if (!id) {
        return callback(new Error());
    }

    database.getCollection('User', function(err, col) {
        if (err) {
            return callback(err);
        }
        col.findOne({_id: id}, callback);
    });

};

/**
 * ユーザーを登録します。
 * @param {Object} user
 * @param {Function} callback
 */
UserService.prototype.register = function(user, callback) {
    database.getCollection('User', function(err, col) {
        if (err) {
            return callback(err);
        }
        var hash = util.createHash(user.pwd);

        var data = {
            _id: user.userId,
            pwd: hash
        };
        col.insert(data, {safe: true}, callback);
    });
};