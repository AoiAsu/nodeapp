
var async = require('async');

var mongo = mongo.get('User');

function AuthService() {

}

module.exports = new AuthService();

AuthService.prototype.login = function(id, pwd, callback) {
    async.series([
        function() {
            // ユーザー情報取得
        },
        function() {
            // ロックアウト対象か確認
            // パスワードが一致するか確認
        },
        function() {
            // 一致したら、ログイン日時書き込み
        }
    ], function(err) {
        // パスワードが一致しなかったときは、failureに日時とカウント書き込み
    });
};