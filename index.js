const app = require("./server");
const port = process.env.port || 3000
app.listen(port, () => {
	console.log('Server start, listening: ' + port)
})
