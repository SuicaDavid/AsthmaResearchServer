const mongoose = require('mongoose')
const shortId = require('shortid')
const { setUTCTime } = require('../utility/dateUtility')

const airQualitySchema = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        // default: shortId.generate
    },
    list: {
        type: Object,
        require: true
    },
    coord: {
        type: Object,
        require: true
    },
    updatedDate: {
        type: Date,
        require: true,
        default: setUTCTime
    },
})

module.exports = mongoose.model("AirQuality", airQualitySchema)