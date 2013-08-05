/**
 * mongoと接続するクラス
 * @file db.js
 * @author Asuki Takamine <takamine_asuki@cyberagent.co.jp>
 */
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