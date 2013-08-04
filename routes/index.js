
/*
 * GET home page.
 */
var users = {
    'asuki': 'takamine'
};

exports.index = function(req, res){
  res.render('index', {
      title: 'Express',
      user: req.session.user
  });
};

exports.login = function(req, res, next) {
    var user = req.body.user;
    if (!user) {
        next();
    }

    Object.keys(users).forEach(function(name) {
        if (user.name === name && user.pwd === users[name]) {
            req.session.user = {
                name: user.name,
                pwd: user.pwd
            };
        }
    });

    next();
};

exports.logout = function(req, res, next) {
    delete req.session.user;
    next();
};

exports.name = function(req, res){
    res.render('index', {
        title: 'Express',
        name: req.params.name
    });
};