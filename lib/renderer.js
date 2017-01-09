var reg = /(\s*)(```) *(flow) *\n?([\s\S]+?)\s*(\2)(\n+|$)/g;
var flows = [];

function ignore(data) {
  var source = data.source;
  var ext = source.substring(source.lastIndexOf('.')).toLowerCase();
  return ['.js', '.css', '.html', '.htm'].indexOf(ext) > -1;
}

function getFlowId(index) {
  return 'flowchart-' + index;
}

exports.before = function (data) {
  if (!ignore(data)) {
    flows = [];
    data.content = data.content
      .replace(reg, function (raw, start, startQuote, lang, content, endQuote, end) {
        var flowId = getFlowId(flows.length);
        flows.push(content);
        return start + '<div id="' + flowId + '" class="flow-chart"></div>' + end;
      });
  }
};

exports.after = function (data) {
  if (flows.length && !ignore(data)) {
    var config = this.config.flowchart;
    // resources
    data.content += '<script src="' + config.raphael + '"></script>';
    data.content += '<script src="' + config.flowchart + '"></script>';
    // exec
    data.content += flows.map(function (code, index) {
      var flowId = getFlowId(index);
      var codeId = flowId + '-code';
      var optionsId = flowId + '-options';
      return '' +
        '<textarea id="' + codeId + '" style="display: none">' + code + '</textarea>' +
        '<textarea id="' + optionsId + '" style="display: none">' + JSON.stringify(config.options) + '</textarea>' +
        '<script>' +
        '  var code = document.getElementById("' + codeId + '").value;' +
        '  var options = JSON.parse(document.getElementById("' + optionsId + '").value);' +
        '  var diagram = flowchart.parse(code);' +
        '  diagram.drawSVG("' + flowId + '", options);' +
        '</script>';
    }).join('');
  }
};