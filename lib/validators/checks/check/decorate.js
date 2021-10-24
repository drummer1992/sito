'use strict'

const { isNil } = require('../../../utils/predicates')
const { and } = require('../../../utils/function')

const makeOptional = validate => value => {
  if (isNil(value)) {
    return true
  }

  return validate(value)
}

module.exports = (check, common) => {
  let validate = check.validate

  if (check.optional) {
    if (common) {
      validate = and(common.validate, validate)
    }

    validate = makeOptional(validate)
  }

  return validate
}