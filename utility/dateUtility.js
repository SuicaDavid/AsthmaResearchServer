function setUTCTime() {
    let date = new Date()
    let utcDate = Date.UTC(
        date.getFullYear(), 
        date.getMonth(), 
        date.getDate(), 
        date.getHours(), 
        date.getMinutes(), 
        date.getSeconds(), 
        date.getMilliseconds())
    return utcDate
}

module.exports = {
    setUTCTime
}