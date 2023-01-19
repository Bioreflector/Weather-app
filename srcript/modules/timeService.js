function convertAmPmTime(time) {
    const timeArr = time.split(':')
    const [hours, minutes] = timeArr
    const amOrPm = hours >= 12 ? 'pm' : 'am'
    const convertHours = hours % 12 || 12
    const finishTime = `${convertHours}:${minutes}${amOrPm}`
    console.log(finishTime)
    return finishTime
  }
  
export function setTime(time, utc) {
    let date = ""
    if (utc) {
      date = new Date(time * 1000).toLocaleString('en-GB', { timeZone: 'UTC' }).split(',')[1]
    } else {
      date = new Date(time * 1000).toLocaleString().split(',')[1]
    }
    const converTime = convertAmPmTime(date)
    return converTime
  }
