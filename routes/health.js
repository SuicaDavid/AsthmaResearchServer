const express = require('express')
const axios = require('axios')
const { setUTCTime } = require('../utility/dateUtility')
const router = express.Router()
const https = require('https')
const mongoose = require('mongoose')
const {
	Participant,
	HeartRate,
	BloodOxygen,
	Activity,
	Drug,
} = require('../models/researchData')
const { count } = require('../models/weather')
const { Uint8ToBase64 } = require('../utility/Utf8ArrayUtility')
const curve = require('curve25519-js')
const { UserKey } = require('../models/userKey')
const ed2curve = require('ed2curve')
const nacl = require('tweetnacl')
nacl.util = require('tweetnacl-util')

const SEED = process.env.SEED
let { private, public } = curve.generateKeyPair(
	Uint8Array.from(Buffer.from(SEED, 'base64'))
)
let privateKeyString = ed2curve.convertSecretKey(private)
let publicKeyString = ed2curve.convertPublicKey(public)
let nonce = nacl.randomBytes(nacl.box.nonceLength)

console.log(Buffer.from(private).toString('base64'))
console.log(Buffer.from(public).toString('base64'))

// Participant.remove({}, (err) => {
// 	console.log('collection removed')
// })
// HeartRate.remove({}, (err) => {
// 	console.log('collection removed')
// })
// BloodOxygen.remove({}, (err) => {
// 	console.log('collection removed')
// })
// Activity.remove({}, (err) => {
// 	console.log('collection removed')
// })
// Drug.remove({}, (err) => {
// 	console.log('collection removed')
// })
// UserKey.remove({}, (err) => {
// 	console.log('collection removed')
// })

const instance = axios.create({
	httpsAgent: new https.Agent({ keepAlive: true }),
	timeout: 500,
})

router.post('/', async (req, res) => {
	let { userId, heartRate, bloodOxygen, activity, drugUsage } = req.body
	let user = await getUserByID(userId)
	if (!user) {
		user = await saveUserId(userId)
	} else {
		clearHealthDataByID(user)
	}
	let hearts = generateHeartRateList(user, heartRate)
	let bloods = generateBloodOxygenList(user, bloodOxygen)
	let activitys = generateActivityList(user, activity)
	let drugs = generateDrugList(user, drugUsage)
	// todo: share activity and drug usage
	Promise.all([
		saveHeartRate(hearts),
		saveBloodOxygen(bloods),
		saveActivity(activitys),
		saveDrug(drugs),
		user.save(),
	])
		.then(() => {
			console.log(user.userId)
			res.end(`Share success`)
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

router.delete('/', async (req, res) => {
	const { userId } = req.query
	Participant.deleteOne({ userId })
		.populate(['heartRate', 'bloodOxygen', 'activity', 'drug'])
		.exec(function (err, data) {
			if (err) {
				console.log(err)
				res.status(500).json({ message: error.message })
				return
			}
			res.send("Delete success")
			console.log(data)
		})
})

router.get('/all', (req, res) => {
	Participant.find({})
		.populate(['heartRate', 'bloodOxygen', 'activity', 'drug'])
		.exec(function (err, data) {
			if (err) handleError(err)
			console.log("fetch all success")
			res.json(data)
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
			res.json(data)
		})
})

router.get('/bloodOxygen', async (req, res) => {
	const { userId } = req.query
	let data = await BloodOxygen.find({})
		.populate('owner')
		.exec(function (err, data) {
			if (err) return handleError(err)
			console.log('The author is %s')
			console.log(data)
			res.json(data)
		})
})

router.get('/activity', async (req, res) => {
	const { userId } = req.query
	let data = await Activity.find({})
		.populate('owner')
		.exec(function (err, data) {
			if (err) return handleError(err)
			console.log('The author is %s')
			console.log(data)
			// prints "The author is Ian Fleming"
			res.json(data)
		})
})

router.get('/drug', async (req, res) => {
	const { userId } = req.query
	let data = await Drug.find({})
		.populate('owner')
		.exec(function (err, data) {
			if (err) return handleError(err)
			console.log('The author is %s')
			console.log(data)
			// prints "The author is Ian Fleming"
			res.json(data)
		})
})

router.post('/plan/all', async (req, res) => {
	const { activity, drug } = req.body
	console.log(activity)
	try {
		await Participant.updateMany(
			{},
			{
				$set: {
					activityType: activity,
					drugType: drug,
				},
			}
		)
		res.end('Success')
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error.message })
	}
})

router.post('/plan', async (req, res) => {
	const { userId, activity, drug } = req.body
	console.log(userId, activity)
	let user = await getUserByID(userId)
	if (user) {
		if (activity) user.activityType = activity
		if (drug) user.drugType = drug
		user.save()
		res.json({activity, drug})
	} else {
		res.status(500).json({ message: 'No user' })
	}
})

router.get('/plan', async (req, res) => {
	const { userId } = req.query
	let user = await getUserByID(userId)
	console.log(req.query)
	if (user) {
		console.log(user.activityType)
		let plans = {
			activity: user.activityType,
			drug: user.drugType,
		}
		res.json(plans)
	} else {
		res.status(500).json({ message: 'No user' })
	}
})

router.post('/key', async (req, res) => {
	for (key in req.body) {
		let data = JSON.parse(key + req.body[key])
		let userKey = new UserKey({
			userId: data.userId,
			publicKey: data.key,
		})
		await userKey.save()
		res.json({
			serverKey: Buffer.from(public).toString('base64'),
			nonce: Buffer.from(nonce).toString('hex'),
		})
		break
	}
})

router.post('/decode', async (req, res) => {
	for (key in req.body) {
		let data = JSON.parse(key + req.body[key])
		console.log(data)
		let secret = data.secret
		UserKey.findOne({ userId: data.userId })
			.then((user) => {
				console.log('----')
				let secretMsg = Uint8Array.from(Buffer.from(secret, 'base64'))
				console.log(secret, secretMsg)
				let decryptedMessage = nacl.box.open(
					secretMsg,
					nonce,
					ed2curve.convertPublicKey(user.publicKey),
					privateKeyString
				)
				console.log(decryptedMessage)
				let message = new TextDecoder().decode(decryptedMessage)
				console.log(message)
				res.end('123')
			})
			.catch((error) => {
				console.log(error)
			})
	}
})

function saveUserId(userId) {
	let user = new Participant({
		_id: new mongoose.Types.ObjectId(),
		userId,
		activityType: {
			name: 'no',
			timeInterval: '',
		},
		drugType: {
			name: 'no',
			timeInterval: '',
		},
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
			.populate(['heartRate', 'bloodOxygen', 'activity', 'drug'])
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
		console.log(heart)
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
		HeartRate.remove({ owner: user._id }),
		BloodOxygen.remove({ owner: user._id }),
		Activity.remove({ owner: user._id }),
		Drug.remove({ owner: user._id }),
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

function generateActivityList(user, activityList) {
	let activitys = []
	for (let i = 0; i < activityList.length; i++) {
		let activity = new Activity({
			owner: user.id,
			activity: activityList[i],
		})
		user.activity.push(activity)
		activitys.push(activity)
	}
	return activitys
}

function saveActivity(activitys) {
	return Activity.insertMany(activitys).then(() => {
		console.log('Activity save success')
	})
}

function generateDrugList(user, drugList) {
	let drugs = []
	for (let i = 0; i < drugList.length; i++) {
		let drug = new Drug({
			owner: user.id,
			drug: drugList[i],
		})
		user.drug.push(drug)
		drugs.push(drug)
	}
	return drugs
}

function saveDrug(drugs) {
	return Drug.insertMany(drugs).then(() => {
		console.log('Drug save success')
	})
}

function handleError(err) {
	console.log(err)
	res.status(500).json({ message: error.message })
	return
}

module.exports = router
