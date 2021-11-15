'use strict'

const Check = require('./check')
const { last } = require('../utils/array')
const { assert } = require('../errors')
const { isObject } = require('../utils/predicates')
const resolve = require('../utils/resolve')
const { kExtra, kList, kCommonCheck } = require('../utils/symbols')

module.exports = class Checks {
  constructor() {
    this[kExtra] = {}
    this[kList] = []
    this[kCommonCheck] = null
  }

  get extra() {
    return this[kExtra]
  }

  async execute(params) {
    const errors = []

    for (const check of this.values()) {
      const error = await check.execute({ ...params, extra: this.extra })

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
      validate: resolve.validate(checkDto, this[kCommonCheck]),
      message: checkDto.message,
    })

    if (checkDto.common) {
      assert(!this[kCommonCheck], 'common check is already defined')

      this[kCommonCheck] = check
    }

    this[kList].push(check)
  }

  last() {
    return last(this.values())
  }

  values() {
    return [...this[kList]]
  }

  isOptional() {
    return this.values().every(check => check.optional || !check.enabled)
  }
}