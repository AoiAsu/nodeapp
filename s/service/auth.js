
var async = require('async');

var mongo = require('../mongo');

var userMongo = mongo.get('User');

function AuthService() {

}

module.exports = new AuthService();

AuthService.prototype.login = function(id, pwd, callback) {
    var user;
    var now = Date.now();
    async.series([
        function(next) {
            // ユーザー情報取得
            userMongo.get({ _id: id }, {}, function(err, result) {
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
            if (failure.time - now > 60 * 1000) {
                return next();
            }

            // 連続指定回以上失敗している
            if (failure.count >= 5) {
                return next();
            }

            return next({name: 'ロックアウト', msg: 'アカウントロック中です。しばらく待ってから試してください。'});
        },
        function(next) {
            // パスワードが一致するか確認
            if (pwd !== user.pwd) {
                return next({name: 'パスワードが不一致'});
            }

            // ログイン日時書き込み
            var data = {
                $set: {
                    success: {
                        time: now
                    }
                },
                $unset: { failure: true }
            };
            userMongo.update({ _id: id }, data, function(err) {
                if (err) {
                    console.log('failed login success update. id:', id);
                    return next(err);
                }
                return next();
            });
        }
    ], function(err) {
        var failedError = { name: 'ログイン失敗', msg: 'ログインに失敗しました。' };
        if (err.name === 'ロックアウト') {
            return callback(err);
        }
        if (err.name !== 'パスワードが不一致') {
            return callback(failedError);
        }
        // failureに日時とカウント書き込み
        var data = {
            $set: { failure: { time: now }},
            $inc: 1
        };
        userMongo.update( { _id: id }, data, function(err) {
            if (err) {
                return callback(failedError);
            }
            return callback();
        });
    });
};