'use strict'

const trimTime = date => {
  date = new Date(date)

  date.setMilliseconds(0)
  date.setSeconds(0)
  date.setMinutes(0)
  date.setHours(0)

  return date
}

const parseDate = date => new Date(isNaN(date) ? date : Number(date))

exports.isInFuture = date => new Date(date).getTime() > Date.now()
exports.isToday = date => trimTime(Date.now()).getTime() === trimTime(date).getTime()
exports.isValidDate = date => parseDate(date).toString() !== 'Invalid Date'
exports.isBefore = (value, date) => new Date(date).getTime() > parseDate(value).getTime()
exports.isAfter = (value, date) => new Date(date).getTime() < parseDate(value).getTime()