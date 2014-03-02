var bbs = require('./bbs');
var home = require('./home');
var userRegister = require('./user/register');

function Routes() {}

module.exports = new Routes();

Routes.prototype.setUp = function(app) {
    app.get('/', home.get);
    app.post('/', home.get);
    app.del('/', home.get);
    app.get('/bbs', bbs.get);
    app.post('/bbs', bbs.post);
    app.get('/user/register', userRegister.get);
    app.post('/user/register', userRegister.post);
    app.get('/:page', home.get);
};