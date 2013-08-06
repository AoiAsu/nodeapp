var util = require('util');

var database = require('./database');

var mongos = {};

function Mongo(name) {
    this.colName = name;
}

exports.Mongo = Mongo;

Mongo.prototype.get = function(selector, field, callback) {
    database.getCollection(this.colName, function(err, col) {
        if (err) {
            return callback(err);
        }
        col.findOne(selector, field, callback);
    });
};

Mongo.prototype.list = function(selector, field, callback) {
    database.getCollection(this.colName, function(err, col) {
        if (err) {
            return callback(err);
        }
        col.find(selector, field, function(err, cursor) {
            if (err) {
                return callback(err);
            }
            cursor.toArray(function(err, docs) {
                if (err) {
                    return callback(err);
                }
                return callback(err, docs);
            });
        });
    });
};

Mongo.prototype.insert = function(data, callback) {
    database.getCollection(this.colName, function(err, col) {
        if (err) {
            return callback(err);
        }
        col.insert(data, {safe: true}, callback);
    });
};

Mongo.prototype.upsert = function(selector, data, callback) {
    database.getCollection(this.colName, function(err, col) {
        if (err) {
            return callback(err);
        }
        col.update(selector, data, { upsert: true }, callback);
    });
};

/**
 *
 * @param selector
 * @param data
 * @param options {new : true/false}
 * @param callback
 */
Mongo.prototype.findAndModify = function(selector, data, options, callback) {
    database.getCollection(this.colName, function(err, col) {
        if (err) {
            return callback(err);
        }
        col.findAndModify(selector, {}, data, options, callback);
    });
};

Mongo.prototype.update = function(selector, data, callback) {
    database.getCollection(this.colName, function(err, col) {
        if (err) {
            return callback(err);
        }
        col.update(selector, data, { safe: true}, callback);
    });
};

Mongo.prototype.remove = function(selector, callback) {
    database.getCollection(this.colName, function(err, col) {
        if (err) {
            return callback(err);
        }
        col.remove(selector, callback);
    });
};

Mongo.prototype.count = function(selector, callback) {
    database.getCollection(this.colName, function(err, col) {
        col.find(selector, { _id: true }, function(err, cursor) {
            if (err) {
                return callback(err);
            }
            cursor.toArray(function(err, docs) {
                if (err) {
                    return callback(err);
                }
                if (!docs) {
                    return callback(err, 0);
                }
                return callback(err, docs.length);
            });
        });
    });
};

function DefaultMongo(name) {
    Mongo.call(this, name);
}

exports.get = function(name) {
    if (!name) {
        return;
    }

    if (mongos[name]) {
        return mongos[name];
    }

    util.inherits(DefaultMongo, Mongo);
    return mongos[name] = new DefaultMongo(name);
};