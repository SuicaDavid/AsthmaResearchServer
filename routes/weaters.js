const express = require('express')
const axios = require('axios')
const weather = require('../models/weather')
const {setUTCTime} = require('../utility/dateUtility')
const router = express.Router()

const WEATHER_API_KEY =  process.env.WEATHER_API_KEY
const MS_PER_MINUTE = 60000
const REQUEST_INTERVAL = 15 * MS_PER_MINUTE



router.get('/', async (req, res)=>{
    req.on('error',function(err){console.log(err)})
    let savedWeather = await weather.findOne({id: req.query.cityId}).exec()
    if(savedWeather) {
        let now = setUTCTime()
        if ((now - savedWeather.updatedDate) > REQUEST_INTERVAL) {
            console.log("Renew")
            fetchWeatherByCityId(req, res)
                .then(result=>{
                    savedWeather.replaceOne({id: req.query.cityId}, result)
                    res.json(result)
                })
        } else {
            console.log("Cache")
            res.json(savedWeather)
        }
    } else {
        console.log("Fetch new weather")
        fetchWeatherByCoordination(req, res)
        .then((result)=>{
            weather.create(result)
            res.json(result)
        })
    }
})

function fetchWeatherByCoordination(req, res) {
    const {lat, lon} = req.query
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    return axios({ url })
    .then(data=>{
        const result = data.data
        return result
    })
    .catch(error=> {
        console.error(error)
        res.status(500).json({message: error.message})
    })
}

function fetchWeatherByCityId(req, res) {
    const {cityId} = req.query
    const url = `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${WEATHER_API_KEY}`
    return axios({ url })
        .then(data=>{
            const result = data.data
            return result
        })
        .catch(error=> {
            console.error(error)
            res.status(500).json({message: error.message})
        })
}

module.exports = router