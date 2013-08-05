/**
 * @fileOverview UserService
 * @file user.js
 * @author Asuki Takamine <takamine_asuki@cyberagent.co.jp>
 */
var database = require('../database');
var userCol;

function UserService() {
    database.getCollection('User', function(err, col) {
        if (err) {
            throw new Error('failed get User Collection.');
        }
        userCol = col;
    });
}

module.exports = new UserService();

UserService.prototype.get = function(id, callback) {
    if (!id) {
        return callback(new Error());
    }

    userCol.findOne({_id: id}, callback);
};