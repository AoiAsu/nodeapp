/**
 * @fileOverview login check
 * @id login.js
 * @auther Asuki Takamine
 */
var authService = require('./service/auth');

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
        authService.login(user.userId, user.pwd, function(err) {
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