const express = require('express')
const axios = require('axios')
const weather = require('../models/weather')
const router = express.Router()

const WEATHER_API_KEY =  process.env.WEATHER_API_KEY
router.post('/all', (req, res)=>{
    const {lat, lon} = req.body
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    axios({ url })
    .then(data=>{
        const result = data.data
        weather.create(result)
        setTimeout(async ()=>{
            let savedWeather = await weather.findOne({name: 'Abbey Wood'}).exec()
            console.log(savedWeather)
        },1000)
        res.json(data.data)
    })
    .catch(error=> {
        console.error(error)
        res.status(500).json({message: error.message})
    })
})

module.exports = router