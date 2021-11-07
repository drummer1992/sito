'use strict'

const { isFunction } = require('./utils/predicates')
const { identity } = require('./utils/function')
const { assert } = require('./errors')

let intercept = identity

module.exports = Object.freeze({
  intercept: (error, extra) => {
    if (error) {
      return intercept(error, extra)
    }
  },
  register: fn => {
    assert(isFunction(fn), 'intercept should be a function')

    intercept = fn
  },
})