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