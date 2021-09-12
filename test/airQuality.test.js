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

test('GET /api/aqi', async () => {
	await supertest(app)
		.get('/api/aqi/?lat=51.5007&lon=0.1246')
		.expect(200)
		.then((response) => {
			expect(response.body.name).toBe(undefined)
			expect(response.body.list[0]).not.toBe(undefined)
			expect(response.body.list[0]).not.toBe(null)
		})
})
