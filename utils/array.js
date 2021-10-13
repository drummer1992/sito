'use strict'

exports.compact = arr => arr.filter(item => !!item)
exports.last = array => array[array.length - 1]
exports.toArray = value => Array.isArray(value) ? value : [value]