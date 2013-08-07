var should = require('should');
var sinon = require('sinon');

var util = require('../../s/util');

var mongo = require('../../s/mongo');
var userMongo = mongo.get('User');

// テスト対象
var authService = require('../../s/service/auth');

describe('s/service/auth.js', function() {
    var sandbox = sinon.sandbox.create();
    var spyCallback;
    var stubUserMongo;

    var TEST_ID = 'test1';
    var TEST_PWD = 'pwd';

    beforeEach(function() {
        spyCallback = sandbox.spy();
        stubUserMongo = sandbox.stub(userMongo);
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('#login', function() {
        it('OK idとパスワードが一致したとき引数なしのcallbackを呼ぶ', function(done) {
            stubUserMongo.get.yields(null, { pwd: util.createHash('pwd') });
            stubUserMongo.update.yields();

            authService.login(TEST_ID, TEST_PWD, function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('OK idとパスワードが一致したときUserをupdateする', function(done) {
            stubUserMongo.get.yields(null, { pwd: util.createHash('pwd') });
            stubUserMongo.update.yields();

            authService.login(TEST_ID, TEST_PWD, function(err) {
                stubUserMongo.update.calledWithMatch(
                    {_id: TEST_ID},
                    {$set: {'login.success': {}}, $unset: {'login.failure': true}}
                ).should.be.true;
                done();
            });
        });

        it('NG idとパスワードが不一致のとき「ログイン失敗」のエラーを返す', function(done) {
            stubUserMongo.get.yields(null, { pwd: 'aaa' });
            stubUserMongo.update.yields();

            authService.login(TEST_ID, TEST_PWD, function(err) {
                err.name.should.equal('ログイン失敗');
                done();
            });
        });

        it('NG idとパスワードが不一致のときUserを更新する', function(done) {
            stubUserMongo.get.yields(null, { pwd: 'aaa' });
            stubUserMongo.update.yields();

            authService.login(TEST_ID, TEST_PWD, function(err) {
                stubUserMongo.update.calledWithMatch(
                    {_id: TEST_ID},
                    {$set: {'login.failure.time': {}}, $inc: {'login.failure.count': 1}}
                ).should.be.true;
                done();
            });
        });

        it('NG ロックアウト条件に一致するとき「ロックアウト」エラーを返却する', function(done) {
            sandbox.stub(Date, 'now').returns(5);
            stubUserMongo.get.yields(null, { login: {failure: {time: 4, count: 5}} });
            stubUserMongo.update.yields();

            authService.login(TEST_ID, TEST_PWD, function(err) {
                err.name.should.equal('ロックアウト');
                done();
            });
        });

        it('OK 前回失敗したが前回の失敗から一定時間たち、パスワードが一致するとき引数なしのcallbackを呼ぶ', function(done) {
            sandbox.stub(Date, 'now').returns(999999999999999999999999);
            stubUserMongo.get.yields(null, { pwd: util.createHash('pwd'), login: {failure: {time: 1, count: 5}} });
            stubUserMongo.update.yields();

            authService.login(TEST_ID, TEST_PWD, function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('OK 1秒前に前回失敗したが失敗回数が指定回数未満、パスワードが一致するとき引数なしのcallbackを呼ぶ', function(done) {
            sandbox.stub(Date, 'now').returns(5);
            stubUserMongo.get.yields(null, { pwd: util.createHash('pwd'), login: {failure: {time: 1000, count: 4}} });
            stubUserMongo.update.yields();

            authService.login(TEST_ID, TEST_PWD, function(err) {
                should.not.exist(err);
                done();
            });
        });
    });
});