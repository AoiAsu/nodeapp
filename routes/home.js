var sanitize = require('validator').sanitize;
/*
 * GET home page.
 */
exports.get = function(req, res){
    var msg = req.query.msg;
  res.render('index');
};