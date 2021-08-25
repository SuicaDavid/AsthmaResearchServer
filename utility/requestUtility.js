function bodyHandle(req) {
    console.log("------------")
    console.log(req.body)
    // console.log(JSON.parse(req.body))
    for (key in req.body) {
        console.log("++")
        console.log(key, " - " , req.body[key])
        for (key2 in req.body[key]) {
            console.log("+++")
            console.log(key2, " - ", )
        }
		// let data = JSON.parse(key + req.body[key])
        // console.log(data)
    }
}

module.exports = {
    bodyHandle
}