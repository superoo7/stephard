const convertSeconds = (seconds: number) => {
  const result = {
    hours: Math.floor(seconds / 60 / 60),
    minutes: Math.floor((seconds / 60) % 60),
    seconds: Math.floor(seconds % 60)
  }
  let display = displayTime(result)
  return { result, display }
}

const displayTime = (result: { hours: number; minutes: number; seconds: number }): string => {
  const hours = result.hours === 0 ? `` : result.hours === 1 ? `1 hour ` : `${result.hours} hours `
  const minutes =
    result.minutes === 0 ? `` : result.minutes === 1 ? `1 minute ` : `${result.minutes} minutes `
  const seconds =
    result.seconds === 0 ? `` : result.seconds === 1 ? `1 second` : `${result.seconds} seconds`
  return `${hours}${minutes}${seconds}`
}

export { convertSeconds, displayTime }
