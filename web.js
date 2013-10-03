var fs = require('fs');
var coffee = require('coffee-script');
var config = require('./config.coffee').config;

var port = process.env.PORT || config.server.port || 1337;
var publicPath = config.paths.public || './public';

require('./server').startServer(port, publicPath);
console.log('Server started on port %d', port);