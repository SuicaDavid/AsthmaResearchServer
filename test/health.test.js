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

const userHealthData = {
    "userId": "123456", 
    "heartRate": [
        {"quantity": 123, "id": "123123", "startTime": "2021-08-04T00:38:23.305Z", "endTime": "2021-08-04T00:38:23.305Z"},
        {"quantity": 121, "id": "123124", "startTime": "2021-08-05T00:39:24.305Z", "endTime": "2021-08-05T00:39:23.305Z"},
        {"quantity": 101, "id": "123125", "startTime": "2021-08-06T00:40:25.305Z", "endTime": "2021-08-06T00:40:23.305Z"},
        {"quantity": 101, "id": "123125", "startTime": "2021-08-07T00:41:26.305Z", "endTime": "2021-08-07T00:41:23.305Z"}
        
    ], 
    "bloodOxygen": [
        {"quantity": 99, "id": "456455", "startTime": "2021-08-04T00:38:23.305Z", "endTime": "2021-08-04T00:38:23.305Z"},
        {"quantity": 98, "id": "456456", "startTime": "2021-08-05T00:38:23.305Z", "endTime": "2021-08-05T00:38:23.305Z"},
        {"quantity": 97, "id": "456457", "startTime": "2021-08-06T00:38:23.305Z", "endTime": "2021-08-06T00:38:23.305Z"},
        {"quantity": 99, "id": "456458", "startTime": "2021-08-07T00:38:23.305Z", "endTime": "2021-08-07T00:38:23.305Z"}
    ], 
    "drugUsage": [
        {"name": "Aspirin", "quantity": 1, "id": "123", "time": "2021-08-04T00:38:23.305Z"},
        {"name": "Aspirin", "quantity": 1, "id": "124", "time": "2021-08-05T00:38:23.305Z"},
        {"name": "Aspirin", "quantity": 1, "id": "125", "time": "2021-08-06T00:38:23.305Z"}
    ],
    "activity": [
        {"name": "walk", "quantity": 1000, "id": "456455", "time": "2021-08-04T00:38:23.305Z"},
        {"name": "walk", "quantity": 1000, "id": "456456", "time": "2021-08-05T00:38:23.305Z"},
        {"name": "walk", "quantity": 1000, "id": "456457", "time": "2021-08-06T00:38:23.305Z"}
    ]
}

test('GET /health', async () => {
	await supertest(app)
		.post('/api/health/')
        .send(userHealthData)
		.expect(200)
		.then((response) => {
            expect(response.text).toBe('Share success')
		})
})
