var assign = require('deep-assign');
var renderer = require('./lib/renderer');

hexo.config.flowchart = assign({
  flowchart: 'https://cdnjs.cloudflare.com/ajax/libs/flowchart/1.6.5/flowchart.min.js',
  raphael: 'https://cdnjs.cloudflare.com/ajax/libs/raphael/2.2.7/raphael.min.js',
  options: {
    'scale': 1,
    'line-width': 1,
    'line-length': 20,
    'text-margin': 20,
    'font-size': 12
  }
}, hexo.config.flowchart);

hexo.extend.filter.register('before_post_render', renderer.before, 9);
hexo.extend.filter.register('after_post_render', renderer.after);

