import {keys} from "@material-ui/core/styles/createBreakpoints"

export function averageHealthData(data) {
    return data.reduce((p, c) => Number.isInteger(p) ? p + parseInt(c.quantity, 10) : parseInt(p.quantity, 10) + parseInt(c.quantity, 10), 0) / data.length
}

export function flattenHealthData(healthData) {
    return healthData.map(data => {
        for (let key in data) {
            if (Array.isArray(data[key])) {
                data[key] = data[key].map(element => {
                    for (let k in element[key][0]) {
                        element[k] = element[key][0][k]
                    }
                    return element
                })
            }
        }
        return data
    })
}

export function flattenHealthDetail(healthDetail) {
    healthDetail = washHealthDetail(healthDetail)
    return healthDetail.map(detail => {
        console.log(detail)
        let data = {
            userId: detail.owner.userId
        }
        let dataType = Object.keys(detail)[0]
        for (let key in detail[dataType][0]) {
            data[key] = detail[dataType][0][key]
        }
        return data
    })
}

export function washHealthDetail(healthDetail) {
    return healthDetail.filter(detail => detail.owner)
}