'use strict'

const { isNil } = require('../../../utils/predicates')
const { and } = require('../../../utils/function')

const makeOptional = validate => value => {
  if (isNil(value)) {
    return true
  }

  return validate(value)
}

module.exports = (check, commonCheck) => {
  let validate = check.validate

  if (check.optional) {
    if (commonCheck) {
      validate = and(commonCheck.validate, validate)
    }

    validate = makeOptional(validate)
  }

  return validate
}