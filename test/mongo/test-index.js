var should = require('should');

// テスト対象
var mongo = require('../../s/mongo');
var testMongo = mongo.get('Test');

describe('s/mongo/index.js', function() {

    describe('#test', function() {
        it('OK', function(done) {
            testMongo.count({ _id: 'asuki'}, function(err, result) {
                console.log(JSON.stringify(result));
                done();
            });
        });
    });
});