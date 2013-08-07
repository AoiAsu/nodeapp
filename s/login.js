/**
 * @fileOverview login check
 * @id login.js
 * @auther Asuki Takamine
 */
var userService = require('./service/user');
var util = require('./util');

var users = {
    'admin': 'admin'
};

function validate(user, callback) {
    var isAdmin = Object.keys(users).some(function(userId) {
        return user.userId === userId && user.pwd === users[userId];
    });
    if (isAdmin) {
        return callback();
    }

    userService.get(user.userId, function(err, result) {
        if (err) {
            console.error(err);
            return callback({msg: 'ログインに失敗しました。'});
        }
        if (!result) {
            return callback({msg: 'ログイン情報に誤りがあります。'});
        }
        if (util.createHash(user.pwd) !== result.pwd) {
            return callback({msg: 'ログイン情報に誤りがあります。'});
        }
        return callback();
    });
}

module.exports = function(req, res, next) {
    // TODO ログインチェック対象外
    if (req.url === '/user/register') {
        return next();
    }

    var method = req.method.toLowerCase();
    var user = req.body.user;
    var logout = (method === 'delete');
    var login = (method === 'post' && user);

    var routes = req.app.routes[method];

    if (!routes) {
        return next();
    }

    if (!login && !logout) {
        if (!req.session.user) {
            req.url = '/';
        }
        return next();
    }

    routes.forEach(function(route) {
        if (!req.url.match(route.regexp)) {
            req.method = 'GET';
        }
    });

    if (logout) {
        delete req.session.user;
        req.url = '/';
        return next();
    }

    if (login) {
        validate(user, function(err) {
            if (err) {
                req.flash('error', err.msg);
                req.url = '/';
                return next();
            }

            req.session.user = {
                userId: user.userId,
                pwd: user.pwd
            };
            return next();
        });
    }
};