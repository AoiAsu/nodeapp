var bbsService = require('../s/service/bbs');

exports.get = function(req, res){
    bbsService.getList(function(err, result) {
        if (err) {
            return res.render('bbs', { err: err.message });
        }

        result = result || [];
        for (var i = 0; i < result.length; i++) {
            var date = new Date(result[i].time);
            result[i].datetime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
        }
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
            for (var i = 0; i < result.length; i++) {
                var date = new Date(result[i].time);
                result[i].datetime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
            }
            return res.render('bbs', { list: result });
        });
    });
};