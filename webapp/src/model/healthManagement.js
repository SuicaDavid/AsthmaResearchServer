import {
    fetchAllActivity,
    fetchAllBloodOxygen, fetchAllDrug,
    fetchAllHeartRate,
    fetchAllUserHealthData,
    fetchUserHealthData
} from "../request/healthDataRequest"
import {createContext, useMemo} from "react"
import {flattenHealthData, flattenHealthDetail} from "../utility/healthDataCalculator"
import {drugPath} from "../request/api"

export default class HealthManagement {
    static healthData = []
    static heartRateData = []
    static bloodOxygenData = []
    static activityData = []
    static drugData = []

    static updateAllHealthData() {
        return fetchAllUserHealthData()
            .then(data=>{
                console.log(data)
                this.healthData = flattenHealthData(data)
                console.log(this.healthData)
                return this.healthData
            })
    }

    static updateAllHeartRate() {
        return fetchAllHeartRate()
            .then(data=>{
                console.log(data)
                this.heartRateData = flattenHealthDetail(data)
                return this.heartRateData
            })
    }

    static updateAllBloodOxygen() {
        return fetchAllBloodOxygen()
            .then(data=>{
                console.log(data)
                this.bloodOxygenData = flattenHealthDetail(data)
                return this.bloodOxygenData
            })
    }

    static updateAllActivity() {
        return fetchAllActivity()
            .then(data=>{
                console.log(data)
                this.activityData = flattenHealthDetail(data)
                return this.activityData
            })
    }

    static updateAllDrug() {
        return fetchAllDrug()
            .then(data=> {
                console.log(data)
                this.drugData = flattenHealthDetail(data)
                console.log(this.drugData)
                return this.drugData
            })
    }
}