import axios from "axios"
import {apiPath} from "./api"

export function fetchUserHealthData(userId) {
    axios.get(apiPath + `/health/?userId=${userId}`)
        .then(data => {
            console.log(data)
        })
}