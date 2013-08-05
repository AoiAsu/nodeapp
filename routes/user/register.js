
var userService = require('../../s/service/user');

exports.get = function(req, res) {
    if (req.session.user) {
        // ログイン済みの場合ここのページを見れない
        return res.redirect('/');
    }
    return res.render('user/register');
};

exports.post = function(req, res) {
    var user = req.body.user;
    // TODO バリデート
    userService.register(user, function(err) {
        if (err) {
            console.log(err);
            req.flash('error', '会員登録に失敗しました。');
            return res.render('user/register', {flash: req.flash()});
        }
        res.render('user/register', {
            isSuccess: true,
            user : user
        });
    });
};