var users = {
    'asuki': 'takamine'
};

function validate(user, callback) {
    var valid = Object.keys(users).some(function(name) {
        return user.name === name && user.pwd === users[name];
    });
    if (!valid) {
        return callback({msg: 'ログイン情報に誤りがあります。'});
    }
    return callback();
}

module.exports = function(req, res, next) {
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
                name: user.name,
                pwd: user.pwd
            };
            return next();
        });
    }
};