
var async = require('async');

var mongo = require('../mongo');
var util = require('../util');

var userMongo = mongo.get('User');

var LOCK_TIME = 5 * 60 * 1000; // 5分
var LOCK_FAILURE_COUNT = 5;

function AuthService() {

}

module.exports = new AuthService();

AuthService.prototype.login = function(userId, pwd, callback) {
    var user;
    var now = Date.now();
    async.series([
        function(next) {
            // ユーザー情報取得
            userMongo.get({ _id: userId }, {}, function(err, result) {
                if (err) {
                    console.log('failed get User. id:', userId);
                    return next(err);
                }
                if (!result) {
                    return next({name: '会員ではない'});
                }
                user = result;
                return next();
            });
        },
        function(next) {
            // 前回失敗していない
            if (!user.login || !user.login.failure) {
                return next();
            }
            var failure = user.login.failure;
            // 前回の失敗から一定時間経っている
            if (now - failure.time > LOCK_TIME) {
                return next();
            }

            // 連続失敗回数が指定回数以下
            if (failure.count < LOCK_FAILURE_COUNT) {
                return next();
            }

            return next({name: 'ロックアウト', msg: 'アカウントロック中です。しばらく待ってから試してください。'});
        },
        function(next) {
            // パスワードが一致するか確認
            if (util.createHash(pwd) !== user.pwd) {
                return next({name: 'パスワードが不一致'});
            }

            // ログイン日時書き込み
            var data = {
                $set: {
                    'login.success': {
                        time: now
                    }
                },
                $unset: { 'login.failure': true }
            };
            userMongo.update({ _id: userId }, data, function(err) {
                if (err) {
                    console.log('failed login success update. id:', userId);
                    return next(err);
                }
                return next();
            });
        }
    ], function(err) {
        if (!err) {
            return callback();
        }

        var failedError = { name: 'ログイン失敗', msg: 'ログインに失敗しました。' };

        if (err.name === 'ロックアウト') {
            return callback(err);
        }

        if (err.name !== 'パスワードが不一致') {
            return callback(failedError);
        }

        // failureに日時とカウント書き込み
        var data = {
            $set: { 'login.failure.time': now },
            $inc: { 'login.failure.count': 1 }
        };
        userMongo.update( { _id: userId }, data, function(err) {
            if (err) {
                // 更新に失敗してもログ出力のみ
                console.log('failed record login failure. id:', userId);
            }
            return callback(failedError);
        });
    });
};