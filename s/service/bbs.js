var mongo = require('../mongo');

var bbsMongo = mongo.get('Bbs');

function BbsService() {}

module.exports = new BbsService();

BbsService.prototype.addComment = function(name, comment, callback) {
    if (!name || !comment) {
        return callback(new Error('項目が足りません'));
    }

    var now = Date.now();
    var data = {
        name: name,
        comment: comment,
        time: now
    };
    bbsMongo.insert(data, callback);
};

BbsService.prototype.getList = function(callback) {
    bbsMongo.list({}, {}, callback);
};
