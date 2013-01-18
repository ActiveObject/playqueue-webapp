var static = require('node-static');
var fileServer = new(static.Server)('./public');

require('http').createServer(function (req, res) {
	req.addListener('end', function () {
		fileServer.serve(req, res, function (err, result) {
			fileServer.serveFile('index.html', 200, {}, req, res);
		});
	});
}).listen(process.env.PORT || 1337);