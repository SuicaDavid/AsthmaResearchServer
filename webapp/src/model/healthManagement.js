import {fetchUserHealthData} from "../request/healthDataRequest"

class HealthManagement {
    healthData = {}
    constructor() {
        this.updateHealthData()
    }

    updateHealthData() {
        fetchUserHealthData(123456)
            .then(data => {
                this.healthData = data
            })
    }
}

export default new HealthManagement()