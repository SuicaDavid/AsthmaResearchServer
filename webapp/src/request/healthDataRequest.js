import axios from "axios"
import {
    apiPath,
    healthDataPath,
    allHealthDataPath,
    bloodOxygenPath,
    activityPath,
    drugPath,
    heartRatePath,
    healthPlanPath, allHealthPlanPath
} from "./api"

export function fetchUserHealthData(userId) {
    return axios.get(healthDataPath + `/?userId=${userId}`)
        .then(data => {
            console.log(data)
            if (data.data != null) {
                return data.data
            } else {
                return {}
            }
        })
        .catch(error => {
            console.error(error)
        })
}

export function fetchAllUserHealthData() {
    return axios.get(allHealthDataPath)
        .then(data => {
            console.log(data)
            if (data.data != null) {
                return data.data
            } else {
                return {}
            }
        })
        .catch(error => {
            console.error(error)
        })
}

export function fetchAllHeartRate() {
    return axios.get(heartRatePath)
        .then(data => {
            console.log(data)
            if (data.data != null) {
                return data.data
            } else {
                return {}
            }
        })
        .catch(error => {
            console.error(error)
        })
}

export function fetchAllBloodOxygen() {
    return axios.get(bloodOxygenPath)
        .then(data => {
            console.log(data)
            if (data.data != null) {
                return data.data
            } else {
                return {}
            }
        })
        .catch(error => {
            console.error(error)
        })
}

export function fetchAllActivity() {
    return axios.get(activityPath)
        .then(data => {
            console.log(data)
            if (data.data != null) {
                return data.data
            } else {
                return {}
            }
        })
        .catch(error => {
            console.error(error)
        })
}

export function fetchAllDrug() {
    return axios.get(drugPath)
        .then(data => {
            console.log(data)
            if (data.data != null) {
                return data.data
            } else {
                return {}
            }
        })
        .catch(error => {
            console.error(error)
        })
}

export function setHealthPlan(data) {
    return axios.post(healthPlanPath, data)
        .then(data => {
            console.log(data)
            return data.data
        })
        .catch(error => {
            console.error(error)
        })
}

export function setAllHealthPlan(data) {
    return axios.post(allHealthPlanPath, data)
        .then(data => {
            console.log(data)
            return data.data
        })
        .catch(error => {
            console.error(error)
        })
}

export function deleteUserHealthData(userId) {
    return axios.delete(healthDataPath + `/?userId=${userId}`)
        .then(data => {
            console.log(data)
            return data.data
        })
        .catch(error => {
            console.error(error)
        })
}