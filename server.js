var static = require('node-static');

exports.startServer = function (port, publicPath, callback) {
  callback = callback || function () {};

  var fileServer = new(static.Server)(publicPath);
  require('http').createServer(function (req, res) {
    req.addListener('end', function () {
      fileServer.serve(req, res, function (err) {
        if (err && (err.status === 404)) {
          fileServer.serveFile('index.html', 200, {}, req, res);
        }
      });
    }).resume();
  }).listen(port, callback);
};
