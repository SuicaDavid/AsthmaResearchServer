const mongoose = require('mongoose')
const shortId = require('shortid')
const { setUTCTime } = require('../utility/dateUtility')
const Schema = mongoose.Schema;
const userKey = new Schema({
	userId: {
		type: String,
		require: true,
	},
    publicKey: {
        type: String,
        require: true
    }
})

module.exports = {
    UserKey: mongoose.model("UserKey", userKey)
}