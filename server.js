const path = require('path')
if (process.env.NODE_ENV != 'product') {
    require('dotenv').config({path: path.join(__dirname, '.env')});
}
const express = require('express')
const mongoose = require('mongoose')
const axios = require("axios")
const Weather = require('./models/weather')
const weatherRouter = require('./routes/weaters')

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

app.listen(3000, ()=>{
    console.log('Server start')
})