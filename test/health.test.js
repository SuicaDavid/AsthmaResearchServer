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

const otherHealthData = {
    "userId": "123457", 
    "heartRate": [
        {"quantity": 121, "id": "123223", "startTime": "2021-08-04T00:38:23.305Z", "endTime": "2021-08-04T00:38:23.305Z"},
        {"quantity": 122, "id": "123224", "startTime": "2021-08-05T00:39:24.305Z", "endTime": "2021-08-05T00:39:23.305Z"},
        {"quantity": 111, "id": "123225", "startTime": "2021-08-06T00:40:25.305Z", "endTime": "2021-08-06T00:40:23.305Z"},
        {"quantity": 141, "id": "123225", "startTime": "2021-08-07T00:41:26.305Z", "endTime": "2021-08-07T00:41:23.305Z"}
        
    ], 
    "bloodOxygen": [
        {"quantity": 99, "id": "456555", "startTime": "2021-08-04T00:38:23.305Z", "endTime": "2021-08-04T00:38:23.305Z"},
        {"quantity": 98, "id": "456556", "startTime": "2021-08-05T00:38:23.305Z", "endTime": "2021-08-05T00:38:23.305Z"},
        {"quantity": 94, "id": "456557", "startTime": "2021-08-06T00:38:23.305Z", "endTime": "2021-08-06T00:38:23.305Z"},
        {"quantity": 97, "id": "456558", "startTime": "2021-08-07T00:38:23.305Z", "endTime": "2021-08-07T00:38:23.305Z"}
    ], 
    "drugUsage": [
        {"name": "Aspirin", "quantity": 1, "id": "133", "time": "2021-08-04T00:38:23.305Z"},
        {"name": "Aspirin", "quantity": 1, "id": "134", "time": "2021-08-05T00:38:23.305Z"},
        {"name": "Aspirin", "quantity": 1, "id": "135", "time": "2021-08-06T00:38:23.305Z"}
    ],
    "activity": [
        {"name": "run", "quantity": 1000, "id": "456555", "time": "2021-08-04T00:38:23.305Z"},
        {"name": "run", "quantity": 500, "id": "456556", "time": "2021-08-05T00:38:23.305Z"},
        {"name": "run", "quantity": 1000, "id": "456557", "time": "2021-08-06T00:38:23.305Z"}
    ]
}

test('POST /health', async () => {
	await supertest(app)
		.post('/api/health/')
        .send(userHealthData)
		.expect(200)
		.then((response) => {
            expect(response.text).toBe('Share success')
		})
})

test('POST /health', async () => {
	await supertest(app)
		.post('/api/health/')
        .send(otherHealthData)
		.expect(200)
		.then((response) => {
            expect(response.text).toBe('Share success')
		})
})

test('GET /health', async () => {
    await supertest(app)
		.get(`/api/health/?userId=${userHealthData.userId}`)
		.expect(200)
		.then((response) => {
			expect(response.body.userId).toBe(userHealthData.userId)
		})
})

test('GET /health/heartRate', async () => {
    await supertest(app)
		.get(`/api/health/heartRate`)
		.expect(200)
		.then((response) => {
            console.log(response.body)
            expect(response.body.length).toBe(otherHealthData.heartRate.length + userHealthData.heartRate.length)
		})
})

test('GET /health/bloodOxygen', async () => {
    await supertest(app)
		.get(`/api/health/bloodOxygen`)
		.expect(200)
		.then((response) => {
            console.log(response.body)
            expect(response.body.length).toBe(otherHealthData.bloodOxygen.length + userHealthData.bloodOxygen.length)
		})
})

test('GET /health/activity', async () => {
    await supertest(app)
		.get(`/api/health/activity`)
		.expect(200)
		.then((response) => {
            console.log(response.body)
            expect(response.body.length).toBe(otherHealthData.activity.length + userHealthData.activity.length)
		})
})

test('GET /health/drug', async () => {
    await supertest(app)
		.get(`/api/health/drug`)
		.expect(200)
		.then((response) => {
            console.log(response.body)
            expect(response.body.length).toBe(otherHealthData.drugUsage.length + userHealthData.drugUsage.length)
		})
})

test('DELETE /health', async () => {
    await supertest(app)
		.delete(`/api/health/?userId=${userHealthData.userId}`)
		.expect(200)
		.then((response) => {
            console.log(response.text)
			expect(response.text).toBe("Delete success")
		})
})

test('GET /health/all', async () => {
    await supertest(app)
		.get(`/api/health/all`)
		.expect(200)
		.then((response) => {
            console.log(response.body)
            expect(response.body.length).toBe(1)
			expect(response.body[0].userId).toBe(otherHealthData.userId)
		})
})

const userPlan = {
    "userId": "123456",
    "activity": {
        "name": "walk",
        "quantity": 1000,
        "timeInterval": "1-day"
    }
}

const allPlan = {
    "activity": {
        "name": "run",
        "quantity": 1000,
        "timeInterval": "2-day"
    },
    "drug": {
        "name": "Aspirin",
        "quantity": 1,
        "timeInterval": "2-day"
    }
}
test('GET /health/plan when no user', async () => {
    await supertest(app)
		.get(`/api/health/plan/?userId=${userHealthData.userId}`)
		.expect(500)
		.then((response) => {
            console.log(response)
            expect(JSON.parse(response.text).message).toBe("No user")
		})
})

test('POST /health new user', async () => {
	await supertest(app)
		.post('/api/health/')
        .send(userHealthData)
		.expect(200)
		.then((response) => {
            expect(response.text).toBe('Share success')
		})
})

test('POST /health/plan/', async () => {
    await supertest(app)
		.post(`/api/health/plan/`)
        .send(userPlan)
		.expect(200)
		.then((response) => {
            console.log(response.body)
		})
})

test('POST /health/plan/all', async () => {
    await supertest(app)
		.post(`/api/health/plan/all/`)
        .send(allPlan)
		.expect(200)
		.then((response) => {
            console.log(response.body)
            expect(JSON.parse(response.text).message).toBe("Success")
		})
})

test('GET /health/plan', async () => {
    await supertest(app)
		.get(`/api/health/plan/?userId=${userHealthData.userId}`)
		.expect(200)
		.then((response) => {
            expect(response.body).toEqual(allPlan)
		})
})