/**
 * @fileOverview mongoと接続するクラス
 * @file database.js
 * @author Asuki Takamine
 */
var async = require('async');
var mongo = require('mongodb');

var collections = {};

function Database() {
    this.db = new mongo.Db('rookis', new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {}), {});
    this.db.open(function(err) {
        if (err) {
            // コネクションが正常に取得できない場合、プロセスkill
            console.log(err);
            process.exit(1);
        } else {
            console.log('initialize mongodb');
        }
    });
}

module.exports = new Database();

/**
 * コレクション名からcollectionを取得します。
 * @param {String} name コレクション名
 * @param {Function} callback
 */
Database.prototype.getCollection = function(name, callback) {
    if (!name) {
        return callback(new Error('[ Db ] name is require.'));
    }

    if (collections[name]) {
        return callback(null, collections[name]); // インスタンスが存在する場合は使いまわす
    }

    this.db.collection(name, function(err, collection) {
        if (err) {
            return callback(err);
        }

        if (collection) {
            collections[name] = collection;
        }

        return callback(null, collection);
    });
};

/**
 * コレクション名の配列から{name: collection}のmapを返却します。
 * @param {Array} names コレクション名の配列
 * @param {Function} callback
 */
Database.prototype.getCollections = function(names, callback) {
    var self = this;
    var cols = {};
    async.forEach(names, function(name, next) {
        self.getCollection(name, function(err, col) {
            if (err) {
                return next(err);
            }
            cols[name] = col;
            next();
        });
    },function(err) {
        if (err) {
            return callback(err);
        }
        return callback(null, cols);
    });
};

Database.prototype.getCol = function(name) {
    console.log('get', name);
    return collections[name];
};