var sanitize = require('validator').sanitize;
/*
 * GET home page.
 */
exports.index = function(req, res){
    var msg = req.query.msg;
  res.render('index');
};