const {setUTCTime} = require('../utility/dateUtility')

test('test the UTC time should be a ms number', () => {
    expect(typeof setUTCTime()).toBe('number')
})

