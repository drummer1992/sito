'use strict'

exports.parseDate = date => new Date(isNaN(date) ? date : Number(date))