var bbsService = require('../s/service/bbs');

exports.get = function(req, res){
    bbsService.getList(function(err, result) {
        if (err) {
            return res.render('bbs', { err: err.message });
        }

        result = result || [];
        return res.render('bbs', { list: result });
    });
};

exports.post = function(req, res) {
    var name = req.body.name;
    var message = req.body.message;

    bbsService.addComment(name, message, function(err) {
        if (err) {
            return res.render('bbs', { err: err.message });
        }

        bbsService.getList(function(err, result) {
            if (err) {
                return res.render('bbs', { err: err.message });
            }

            result = result || [];
            return res.render('bbs', { list: result });
        });
    });
};