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
    }],
    activityType: {
        type: Object,
        require: false
    },
    activity: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Activity' 
    }]
})

const heartRate = new Schema({
	owner: {
		type: Schema.Types.ObjectId, 
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
		ref: 'Participant',
    },
    bloodOxygen: {
        type: Array,
		require: true,
    }
})

const activity = new Schema({
    owner: {
        type: Schema.Types.ObjectId, 
		ref: 'Participant',
    },
    activity: {
        type: Array,
        require: true
    }
})

module.exports = { 
    Participant: mongoose.model('Participant', participant),
    HeartRate: mongoose.model('HeartRate', heartRate),
    BloodOxygen: mongoose.model('BloodOxygen', bloodOxygen),
    Activity: mongoose.model('Activity', activity)
}
