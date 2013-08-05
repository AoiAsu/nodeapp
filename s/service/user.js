/**
 * @fileOverview UserService
 * @file user.js
 * @author Asuki Takamine <takamine_asuki@cyberagent.co.jp>
 */
var database = require('../database');

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