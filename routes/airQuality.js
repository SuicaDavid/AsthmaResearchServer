const express = require('express')
const axios = require('axios')
const { setUTCTime } = require('../utility/dateUtility')
const router = express.Router()
const cityListJson = require('../city.list.json')
const https = require('https')
const { url } = require('inspector')
const {
	MS_PER_MINUTE,
	REQUEST_INTERVAL,
} = require('../constant/requestConstant')
const airQuality = require('../models/weather')

const WEATHER_API_KEY = process.env.WEATHER_API_KEY

const instance = axios.create({
	httpsAgent: new https.Agent({ keepAlive: true }),
	timeout: 500,
})

router.get('/', async (req, res) => {
	req.on('error', function (err) {
		console.log(err)
	})
	let city = cityListJson.find((city) => city.name === req.query.cityName)
	req.city = city
	console.log(city, city.name)
	fetchCurrentAQIByCoordination(req, res).then((result) => {
		// airQuality.create(result)
        res.json(result)
	})
})

router.get('/forecast',  async (req, res) => {
	req.on('error', function (err) {
		console.log(err)
	})
	let city = cityListJson.find((city) => city.name === req.query.cityName)
	req.city = city
	console.log(city, city.name)
	fetchFutureAQIByCoordination(req, res).then((result) => {
		// airQuality.create(result)
        res.json(result)
	})
})

function fetchCurrentAQIByCoordination(req, res) {
	const { lat, lon } = req.query
	const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
	return instance
		.get(url)
		.then((data) => {
			const result = data.data
			return result
		})
		.catch((error) => {
			console.error(error)
			res.status(500).json({ message: error.message })
		})
}

function fetchFutureAQIByCoordination(req, res) {
    const { lat, lon } = req.query
	const url = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
	return instance
		.get(url)
		.then((data) => {
			const result = data.data
			return result
		})
		.catch((error) => {
			console.error(error)
			res.status(500).json({ message: error.message })
		})
}
module.exports = router
