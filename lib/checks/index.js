'use strict'

const Check = require('./check')
const { last } = require('../utils/array')
const { assert } = require('../errors')
const { intercept } = require('../interceptor')
const { isObject } = require('../utils/predicates')
const resolve = require('../utils/resolve')

const EXTRA = Symbol('extra')
const LIST = Symbol('list')
const COMMON_CHECK = Symbol('commonCheck')

module.exports = class Checks {
  constructor() {
    this[EXTRA] = {}
    this[LIST] = []
    this[COMMON_CHECK] = null
  }

  get extra() {
    return this[EXTRA]
  }

  async execute(params) {
    const errors = []

    for (const check of this.values()) {
      const result = await check.execute(params)
      const error = await intercept(result, { extra: this.extra, check, ...params })

      if (error) {
        if (params.throwFirst) throw error

        errors.push(error)
      }
    }

    return errors
  }

  add(checkDto) {
    assert(isObject(checkDto), 'check should be an object')

    const check = new Check({
      ...checkDto,
      validate: resolve.validate(checkDto, this[COMMON_CHECK]),
      message: checkDto.message,
    })

    if (checkDto.common) {
      assert(!this[COMMON_CHECK], 'common check is already defined')

      this[COMMON_CHECK] = check
    }

    this[LIST].push(check)
  }

  last() {
    return last(this.values())
  }

  values() {
    return [...this[LIST]]
  }

  isOptional() {
    return this.values().every(check => check.optional || !check.enabled)
  }
}