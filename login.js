var users = {
    'asuki': 'takamine'
};

module.exports = function(req, res, next) {
    var method = req.method.toLowerCase();
    var user = req.body.user;
    var logout = (method === 'delete');
    var login = (method === 'post' && user);

    var routes = req.app.routes[method];

    if (!routes) {
        return next();
    }

    if (login || logout) {
        routes.forEach(function(route) {
            if (!req.url.match(route.regexp)) {
                req.method = 'GET';
            }
        });
    }

    if (logout) {
        delete req.session.user;
    }

    if (login) {
        Object.keys(users).forEach(function(name) {
            if (user.name === name && user.pwd === users[name]) {
                req.session.user = {
                    name: user.name,
                    pwd: user.pwd
                }
            }
        });
    }

    if (!req.session.user) {
        req.url = '/';
    }

    next();
};