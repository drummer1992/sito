'use strict'

const { isFunction } = require('./utils/predicates')
const { identity } = require('./utils/function')
const { assert } = require('./errors')

const Interceptor = {
  onError: identity,
  onBulkError: identity,
}

const BAD_NAME_MSG = `not valid interceptor name provided. should be one of [${Object.keys(Interceptor).join(', ')}]`

module.exports = Object.freeze({
  set(name, interceptor) {
    assert(Interceptor[name], BAD_NAME_MSG)
    assert(isFunction(interceptor), 'interceptor should be a function')

    Interceptor[name] = interceptor
  },
  run(name, ...args) {
    assert(Interceptor[name], BAD_NAME_MSG)

    return Interceptor[name](...args)
  },
})