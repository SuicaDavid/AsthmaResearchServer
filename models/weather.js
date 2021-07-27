const mongoose = require('mongoose')
const shortId = require('shortid')

const weatherSchema = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        // default: shortId.generate
    },
    name: {
        type: String,
        require: true
    },
    coord: {
        type: Object,
        require: true
    },
    updatedDate: {
        type: Date,
        require: true,
        default: new Date
    },
    weather: {
        type: Array,
        require: true
    },
    base: {
        type: String,
        require: true
    },
    main: {
        type: Object,
        require: true
    },
    visibility: {
        type: Number,
        require: true
    },
    wind: {
        type: Object,
        require: false
    },
    clouds: {
        type: Object,
        require: false
    },
    rain: {
        type: Object,
        require: false
    },
    snow: {
        tyoe: Object,
        require: false
    },
    dt: {
        type: Number,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    sys: {
        type: Object,
        require: true
    },
    cod: {
        type: Number,
        require: true
    },
})

module.exports = mongoose.model("Weather", weatherSchema)