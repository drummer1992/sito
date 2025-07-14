'use strict'

const SchemaValidator = require('./schema')
const { object } = require('../checks/list')
const { assert } = require('../errors')
const { isObject } = require('../utils/predicates')

module.exports = class ObjectValidator extends SchemaValidator {
  constructor() {
    super()

    this.check({ ...object(), common: true })
  }

  notEmpty() {
    return this.check(object.notEmpty())
  }

  getShape() {
    return { ...(super.getShape() || {}) }
  }

  shape(shape) {
    assert(isObject(shape), 'shape must be an object')

    return super.shape(shape)
  }

  toJsonSchema(options = {}) {
    const schema = super.toJsonSchema(options)

    schema.type = 'object'

    const shape = this.getShape()

    if (shape) {
      schema.properties = {}
      schema.required = []

      for (const [key, validator] of Object.entries(shape)) {
        const propSchema = validator.toJsonSchema()

        schema.properties[key] = propSchema

        if (Array.isArray(propSchema.required) ? propSchema.required.length : propSchema.required) {
          schema.required.push(key)
        }
      }

      if (!schema.required.length) {
        delete schema.required
      }
    }

    return schema
  }
}
