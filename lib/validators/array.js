'use strict'

const SchemaValidator = require('./schema')
const { array } = require('../checks/list')
const { assert } = require('../errors')
const { toArray } = require('../utils/array')

module.exports = class ArrayValidator extends SchemaValidator {
  constructor() {
    super()

    this.check({ ...array(), common: true })
  }

  notEmpty() {
    return this.check(array.notEmpty())
  }

  getShape() {
    return [...super.getShape() || []]
  }

  shape(shape) {
    assert(Array.isArray(shape), 'shape must be an array')

    return super.shape(shape)
  }

  length(n) {
    return this.check(array.hasLength(n))
  }

  max(n) {
    return this.check(array.max(n))
  }

  min(n) {
    return this.check(array.min(n))
  }

  normalize() {
    return this.transform(toArray, { optional: true })
  }

  toJsonSchema(options = {}) {
    const schema = super.toJsonSchema(options)

    schema.type = 'array'

    const shapeValidator = this.getShapeValidator()

    if (shapeValidator) {
      schema.items = shapeValidator.toJsonSchema()
    }

    const shape = this.getShape()

    if (shape && shape.length) {
      schema.items = shape.map(validator => validator.toJsonSchema())
    }

    return schema
  }
}
