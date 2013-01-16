express  = require 'express'

exports.startServer = (port, publicPath, callback = (->)) ->
	host = 'localhost'
	app = express()
	app.use express.static publicPath
	app.get '*', (req, res) -> res.redirect('/')

	app.listen port, host
	app.on 'listening', callback
	app
