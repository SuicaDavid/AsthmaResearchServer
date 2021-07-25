const mongoose = require('mongoose')
const shortId = require('shortid')

const weatherSchema = new mongoose.Schema({
    updatedDate: {
        type: Date,
        require: true
    },
    weather: {
        type: Object,
        require: true,
        default: shortId.generate
    }
})

module.exports = mongoose.model("Weather", weatherSchema)