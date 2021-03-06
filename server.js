const path = require('path')
// if (process.env.NODE_ENV != 'product') {
require('dotenv').config({ path: path.join(__dirname, '.env') })
// }
const port = process.env.port || 3000
const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const Weather = require('./models/weather')
const weatherRouter = require('./routes/weaters')
const airQualityRouter = require('./routes/airQuality')
const healthRouter = require('./routes/health')
const multer = require('multer')

// handle socket hang up error
delete process.env['http_proxy']
delete process.env['HTTP_PROXY']
delete process.env['https_proxy']
delete process.env['HTTPS_PROXY']

const app = express()

mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.on('open', () => console.log('Connected to DB'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(multer().array())

app.use(express.static('public'))

app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

	// Request methods you wish to allow
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	)

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true)

	// Pass to next layer of middleware
	next()
})
app.use(express.static(path.join(__dirname, 'webapp/build/')))
app.use('/api/weather', weatherRouter)
app.use('/api/aqi', airQualityRouter)
app.use('/api/health', healthRouter)

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'webapp/build/', 'index.html'))
})

if (process.env.NODE_ENV !== 'test') {
	app.listen(port, () => {
		console.log('Server start, listening: ' + port)
	})
}

module.exports = app
