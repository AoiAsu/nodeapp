
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user/register')
    , http = require('http')
    , path = require('path')
    , flash = require('connect-flash');

var app = express();
app.locals.compiler = require('./s/customJadeCompiler');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('takamineasukikey'));
app.use(express.session());
app.use(express.csrf());
app.use(flash());
app.use(require('./s/login'));
app.use(function(req, res, next) {
    res.locals.title = 'Asuki';
    res.locals.user = req.session.user;
    res.locals.flash = req.flash();
    res.locals._csrf = req.session._csrf;
    next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', routes.index);
app.del('/', routes.index);
//app.get('/user', user.list);
app.get('/user/register', user.get);
app.post('/user/register', user.post);
app.get('/:page', routes.index);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
