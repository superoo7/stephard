import { convertSeconds, displayTime } from '../time'

describe('time', () => {
  it('show correct time', () => {
    const testResult = convertSeconds(3661)
    const expectedResult = {
      hours: 1,
      minutes: 1,
      seconds: 1
    }
    expect(testResult.result).toEqual(expectedResult)
  })
  it('show correct singular form of the result', () => {
    const testResult = convertSeconds(3661)
    const expectedResult = `1 hour 1 minute 1 second`
    expect(testResult.display).toBe(expectedResult)
  })
})
