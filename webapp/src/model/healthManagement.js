import {fetchAllUserHealthData, fetchUserHealthData} from "../request/healthDataRequest"
import {createContext, useMemo} from "react"
import {flattenHealthData} from "../utility/healthDataCalculator"

export default class HealthManagement {
    static healthData = []

    static updateAllHealthData() {
        return fetchAllUserHealthData()
            .then(data=>{
                console.log(data)
                this.healthData = flattenHealthData(data)
                console.log(this.healthData)
                return this.healthData
            })
    }
}