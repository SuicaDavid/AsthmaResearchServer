const path = require('path')
if (process.env.NODE_ENV != 'product') {
    require('dotenv').config({path: path.join(__dirname, '.env')});
}
const express = require('express')
const mongoose = require('mongoose')
const axios = require("axios")
const Weather = require('./models/weather')
const weatherRouter = require('./routes/weaters')
const airQualityRouter = require('./routes/airQuality')

// handle socket hang up error
delete process.env['http_proxy'];
delete process.env['HTTP_PROXY'];
delete process.env['https_proxy'];
delete process.env['HTTPS_PROXY'];

const app = express()

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', (error)=> console.log(error))
db.on('open', ()=> console.log("Connected to DB"))

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(express.static('public'))

app.use('/api/weather', weatherRouter)
app.use('/api/aqi', airQualityRouter)

app.listen(3000, ()=>{
    console.log('Server start')
})