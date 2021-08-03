const express = require('express')
const axios = require('axios')
const weather = require('../models/weather')
const {setUTCTime} = require('../utility/dateUtility')
const router = express.Router()
const cityListJson = require('../city.list.json')
const https = require('https')
const { url } = require('inspector')

const WEATHER_API_KEY =  process.env.WEATHER_API_KEY
const MS_PER_MINUTE = 60000
const REQUEST_INTERVAL = 15 * MS_PER_MINUTE

const instance = axios.create({
    httpsAgent: new https.Agent({keepAlive: true}),
    timeout: 500
})

router.get('/', async (req, res)=>{
    req.on('error',function(err){console.log(err)})
    let city = cityListJson.find(city=>city.name === req.query.cityName)
    req.city = city
    console.log(city, city.name)
    let savedWeather = await weather.findOne({name: city.name}).exec()
    console.log(savedWeather)
    if(savedWeather) {
        let now = setUTCTime()
        console.log(now, savedWeather.updatedDate, now - savedWeather.updatedDate, REQUEST_INTERVAL)
        if ((now - savedWeather.updatedDate) > REQUEST_INTERVAL) {
            console.log("Renew")
            fetchWeatherByCityId(req, res)
                .then(result=>{
                    savedWeather.replaceOne({id: city.id}, result)
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

router.delete('/', async (req, res)=> {
    let {id} = req.query
    try {
        let savedWeather = await weather.findOne({id: id}).exec()
        if (savedWeather) {
            savedWeather.delete()
            res.end("Finish")
        } else {
            res.end("Nothing to delete")
        }
    } catch(error) {
        console.log(error)
        console.error(error)
        res.status(500).json({message: error.message})
    }
})

function fetchWeatherByCoordination(req, res) {
    const {lat, lon} = req.query
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    return instance.get(url)
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
    const {id} = req.city
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${WEATHER_API_KEY}`
    return instance.get(url)
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