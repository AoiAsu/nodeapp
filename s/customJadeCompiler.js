var jade = require('jade');
var util = require('util');

function CompileWithCsrf(node, options) {
    jade.Compiler.call(this, node, options);
}

util.inherits(CompileWithCsrf, jade.Compiler);

module.exports = CompileWithCsrf;

/**
 * csrf対策用のinputタグを追加する
 * @param tag
 * @override
 */
CompileWithCsrf.prototype.visitTag = function(tag) {
    if (tag.name === 'form' && tag.getAttribute('method').match(/post/i)) {
        var csrfInput = new jade.nodes.Tag('input')
            .setAttribute('type', '"hidden"')
            .setAttribute('name', '"_csrf"')
            .setAttribute('value', '_csrf');
        tag.block.push(csrfInput);
    }
    jade.Compiler.prototype.visitTag.call(this, tag);
};