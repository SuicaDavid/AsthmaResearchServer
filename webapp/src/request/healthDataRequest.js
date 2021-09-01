import axios from "axios"
import {apiPath, healthDataPath, allHealthDataPath} from "./api"

export function fetchUserHealthData(userId) {
    return axios.get(healthDataPath + `/?userId=${userId}`)
        .then(data => {
            console.log(data)
            if(data.data!=null) {
                return data.data
            } else {
                return {}
            }
        })
        .catch(error=>{
            console.error(error)
        })
}

export function fetchAllUserHealthData() {
    return axios.get(allHealthDataPath)
        .then(data => {
            console.log(data)
            if(data.data!=null) {
                return data.data
            } else {
                return {}
            }
        })
        .catch(error=>{
            console.error(error)
        })
}