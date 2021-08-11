import axios from "axios"
import {apiPath} from "./api"

export function fetchUserHealthData(userId) {
    return axios.get(apiPath + `/health/?userId=${userId}`)
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