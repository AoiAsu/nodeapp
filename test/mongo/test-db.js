var should = require('should');
var sinon = require('sinon');

// テスト対象
var database = require('../../s/mongo/database');

describe('s/database.js', function() {
    var sandbox = sinon.sandbox.create();
    var spyCallback;

    beforeEach(function() {
        spyCallback = sandbox.spy();
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('#getCollection', function() {
        it('OK エラーなし・コレクション取得', function(done) {
            database.getCollection('testCollection', function(err, collection) {
                should.not.exist(err);
                should.exist(collection);
                done();
            });
        });

        it('OK すでにcollectionインスタンスが存在する場合は使いまわす', function() {
            // 振る舞いを定義
            sandbox.stub(database.db, 'collection').yields(null, {});

            // テスト
            database.getCollection('A', spyCallback);
            database.getCollection('A', spyCallback);

            // 確認
            database.db.collection.calledOnce.should.be.true;
            should.exist(spyCallback.args[0][1]);
            should.exist(spyCallback.args[1][1]);
        });

        it('NG nameがnullのときエラーが返却される', function(done) {
            database.getCollection(null, function(err) {
                should.exist(err);
                done();
            });
        });

    });

    describe('#getCollections', function() {
        it('OK', function(done) {
            database.getCollections(['A', 'B', 'C'], function(err, cols) {
                should.not.exist(err);
                should.exist(cols.A);
                should.exist(cols.B);
                should.exist(cols.C);
                done();
            });
        });
    });
});