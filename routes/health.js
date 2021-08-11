const express = require('express')
const axios = require('axios')
const { setUTCTime } = require('../utility/dateUtility')
const router = express.Router()
const https = require('https')
const { url } = require('inspector')
const mongoose = require('mongoose')
const {
	Participant,
	HeartRate,
	BloodOxygen,
} = require('../models/researchData')
const { count } = require('../models/weather')

Participant.remove({}, (err) => {
	console.log('collection removed')
})
HeartRate.remove({}, (err) => {
	console.log('collection removed')
})
BloodOxygen.remove({}, (err) => {
	console.log('collection removed')
})

const instance = axios.create({
	httpsAgent: new https.Agent({ keepAlive: true }),
	timeout: 500,
})

router.post('/', async (req, res) => {
	let { userId, heartRate, bloodOxygen, activity } = req.body
	let user = await getUserByID(userId)
	console.log("-----------")
	console.log(user)
	if (!user) {
		user = await saveUserId(userId)
	} else {
		clearHealthDataByID(user)
		console.log("++++")
		console.log(await HeartRate.find({}))
	}
	let hearts = generateHeartRateList(user, heartRate)
	let bloods = generateBloodOxygenList(user, bloodOxygen)
	Promise.all([saveHeartRate(hearts), saveBloodOxygen(bloods), user.save()])
		.then(() => {
			res.end('Share success')
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({ message: error.message })
		})
})

router.get('/', async (req, res) => {
	const { userId } = req.query
	getUserByID(userId)
		.then((data) => {
			res.json(data)
		})
		.catch((error) => {
			res.status(500).json({ message: error.message })
		})
})

router.get('/all', (req, res) => {
	Participant.find({})
		.populate(['heartRate', 'bloodOxygen'])
		.exec(function (err, data) {
			if (err) {
				console.log(err)
				res.status(500).json({ message: error.message })
				return
			}
			console.log('The data is %s', data)
			res.json(data)
			// prints "The author is Ian Fleming"
		})
})

router.get('/heartRate', async (req, res) => {
	const { userId } = req.query
	let data = await HeartRate.find({})
		.populate('owner')
		.exec(function (err, data) {
			if (err) return handleError(err)
			console.log('The author is %s')
			console.log(data)
			// prints "The author is Ian Fleming"
		})
	res.json(data)
})

router.get('/bloodOxygen', async (req, res) => {
	const { userId } = req.query
	let data = await BloodOxygen.find({})
		.populate('owner')
		.exec(function (err, data) {
			if (err) return handleError(err)
			console.log('The author is %s')
			console.log(data)
			// prints "The author is Ian Fleming"
		})
	res.json(data)
})

function saveUserId(userId) {
	let user = new Participant({
		_id: new mongoose.Types.ObjectId(),
		userId,
	})
	return new Promise((resolve, reject) => {
		let participant = Participant.create(user, (err) => {
			if (err) return reject(err)
			resolve(user)
		})
	})
}

function getUserByID(userId) {
	return new Promise((resolve, reject) => {
		Participant.findOne({ userId })
			.populate(['heartRate', 'bloodOxygen'])
			.exec(function (err, data) {
				if (err) reject(err)
				console.log('The data is %s', data)
				resolve(data)
			})
	})
}

function generateHeartRateList(user, heartRate) {
	let hearts = []
	for (let i = 0; i < heartRate.length; i++) {
		let heart = new HeartRate({
			owner: user.id,
			heartRate: heartRate[i],
		})
		user.heartRate.push(heart)
		hearts.push(heart)
	}
	return hearts
}

function saveHeartRate(hearts) {
	return HeartRate.insertMany(hearts).then(() => {
		console.log('Heart rate save success')
	})
}

function clearHealthDataByID(user) {
	return Promise.all([
		HeartRate.remove({owner: user._id}),
		BloodOxygen.remove({owner: user._id})
	])
}

function generateBloodOxygenList(user, bloodOxygen) {
	let bloods = []
	for (let i = 0; i < bloodOxygen.length; i++) {
		let blood = new BloodOxygen({
			owner: user.id,
			bloodOxygen: bloodOxygen[i],
		})
		user.bloodOxygen.push(blood)
		bloods.push(blood)
	}
	return bloods
}

function saveBloodOxygen(bloods) {
	return BloodOxygen.insertMany(bloods).then(() => {
		console.log('blood oxygen save success')
	})
}

module.exports = router
