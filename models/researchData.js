const mongoose = require('mongoose')
const shortId = require('shortid')
const { setUTCTime } = require('../utility/dateUtility')
const Schema = mongoose.Schema;
const participant = new Schema({
    _id: Schema.Types.ObjectId,
	userId: {
		type: String,
		require: true,
	},
    heartRate: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'HeartRate' 
    }],
    bloodOxygen: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'BloodOxygen' 
    }]
})

const heartRate = new Schema({
	owner: {
		type: Schema.Types.ObjectId, 
		require: true,
		ref: 'Participant',
	},
	heartRate: {
		type: Array,
		require: true,
	},
})

const bloodOxygen = new Schema({
    owner: {
        type: Schema.Types.ObjectId, 
		require: true,
		ref: 'Participant',
    },
    bloodOxygen: {
        type: Array,
		require: true,
    }
})

module.exports = { 
    participant: mongoose.model('Participant', participant),
    heartBeats: mongoose.model('HeartRate', heartRate),
    bloodSaturation: mongoose.model('BloodOxygen', bloodOxygen)
}
