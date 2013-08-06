var util = require('util');

var database = require('../database');
var mongos = {};

function Mongo(col) {
    this._col = col;
}

exports.Mongo = Mongo;

function DefaultMongo(name) {
    Mongo.call(this, database.getCollection(name, ));
}

exports.get = function(name) {
    if (!name) {
        return;
    }

    if (mongos[name]) {
        return mongos[name];
    }

    util.inherits(DefaultMongo, Mongo);
    console.log('use default mongo');
    mongos[name] = new Mongo(name);
    return mongos[name];
};