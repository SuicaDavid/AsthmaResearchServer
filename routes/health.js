const express = require('express')
const axios = require('axios')
const { setUTCTime } = require('../utility/dateUtility')
const router = express.Router()
const https = require('https')
const { url } = require('inspector')
const mongoose = require('mongoose')
const {
	participant,
	heartBeats,
	bloodSaturation,
} = require('../models/researchData')

participant.remove({}, (err) => { 
	console.log('collection removed') 
 })
heartBeats.remove({}, (err) => { 
	console.log('collection removed') 
 })
bloodSaturation.remove({}, (err) => { 
	console.log('collection removed') 
 })

const instance = axios.create({
	httpsAgent: new https.Agent({ keepAlive: true }),
	timeout: 500,
})

router.post('/', (req, res) => {
	let { userId, heartRate, bloodOxygen, activity } = req.body
	saveUserId(userId)
		.then((user)=>{
			Promise.all([
				saveHeartRate(user._id, heartRate),
				saveBloodOxygen(user._id, bloodOxygen),
			])
			.then(()=>{
				res.end("Share success")
			})
			.catch(error=>{
				console.log(error)
				res.status(500).json({message: error.message})
			})
		})
		.catch(error=>{
			console.log(error)
			res.status(500).json({message: error.message})
		})
})

router.get('/', (req, res) => {
	const {userId} = req.query
	console.log(userId)
	participant.findOne({userId})
	.populate('heartRate')
	.exec(function (err, data) {
	  if (err) {
		  console.log(err)
		  res.status(500).json({message: error.message})
		  return
	  }
	  console.log('The data is %s', data);
	  res.json(data)
	  // prints "The author is Ian Fleming"
	});
})

function saveUserId(userId) {
	let user = {
		_id: new mongoose.Types.ObjectId(),
		userId,
	}
	return new Promise((resolve, reject) => {
		participant.create( user, (err) => {
				if (err) return reject()
				resolve(user)
			}
		)
	})	
}

function saveHeartRate(id, heartRate) {
	let hearts = []
	for(let i = 0; i < heartRate.length; i++) {
		let heart = {
			_id: id,
			heartRate: heartRate[i]
		}
	}
	return heartBeats.insertMany(heartRate)
		.then(()=>{
			console.log("heart beats save success")
		})
}

function saveBloodOxygen(id, bloodOxygen) {
	for(let i = 0; i < bloodOxygen.length; i++) {
		bloodOxygen[i]._id = id
	}
	return heartBeats.insertMany(bloodOxygen)
		.then(()=>{
			console.log("blood oxygen save success")
		})
}

module.exports = router
