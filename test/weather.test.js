const app = require('../server')
const mongoose = require('mongoose')
const supertest = require('supertest')

beforeAll((done) => {
	mongoose.connect(
		process.env.DATABASE_URL,
		{ useNewUrlParser: true, useUnifiedTopology: true },
		() => done()
	)
})

afterAll((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done())
	})
})

test('GET /api/weather', async () => {
	await supertest(app)
		.get('/api/weather?lat=51.5007&lon=0.1246&cityName=Abbey+Wood')
		.expect(200)
		.then((response) => {
			expect(response.body.name).toBe('Abbey Wood')
		})
})

test('DELETE /api/weather', async () => {
	await supertest(app)
		.delete('/api/weather?id=7302135')
		.expect(200)
		.then((response) => {
			console.log(response.body)
		})
})

test('DELETE /api/weather no content', async () => {
	await supertest(app)
		.delete('/api/weather?id=3333229')
		.expect(200)
		.then((response) => {
			expect(response.text).toBe('Nothing to delete')
		})
})
