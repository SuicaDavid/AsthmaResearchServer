const path = require('path')
if (process.env.NODE_ENV != 'product') {
	require('dotenv').config({ path: path.join(__dirname, '.env') })
}
const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const Weather = require('./models/weather')
const weatherRouter = require('./routes/weaters')
const airQualityRouter = require('./routes/airQuality')
const healthRouter = require('./routes/health')

// handle socket hang up error
delete process.env['http_proxy']
delete process.env['HTTP_PROXY']
delete process.env['https_proxy']
delete process.env['HTTPS_PROXY']

const app = express()

mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.on('open', () => console.log('Connected to DB'))

app.use(
	express.urlencoded({
		extended: true,
	})
)
app.use(express.json())
app.use(express.static('public'))

app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001')

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

app.use('/api/weather', weatherRouter)
app.use('/api/aqi', airQualityRouter)
app.use('/api/health', healthRouter)

app.listen(3000, () => {
	console.log('Server start')
})
