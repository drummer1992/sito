'use strict'

const GenericValidator = require('./generic')
const { assert } = require('../errors')
const { isEmpty, isFunction } = require('../utils/predicates')
const { softAssign } = require('../utils/object')
const { kOf, kShape, kIsStrict } = require('../utils/symbols')

const mightBeValidator = value => value instanceof GenericValidator || isFunction(value)

const ensureShapeIsValid = shape => {
  for (const key of Object.keys(shape)) {
    assert(mightBeValidator(shape[key]), `bad validator '${key}' provided`)
  }
}

const resolveShape = shapeOrSchema => shapeOrSchema instanceof SchemaValidator
    ? shapeOrSchema.getShape()
    : shapeOrSchema

class SchemaValidator extends GenericValidator {
  constructor() {
    super()

    this[kOf] = null
    this[kShape] = null
    this[kIsStrict] = false
  }

  static create(value) {
    const validator = new this()

    if (mightBeValidator(value)) {
      validator.of(value)
    } else if (value) {
      validator.shape(value)
    }

    return validator
  }

  isStrict() {
    return this[kIsStrict]
  }

  strict(isStrict = true) {
    this[kIsStrict] = isStrict

    return this
  }

  of(shapeValidator) {
    assert(isEmpty(this.getShape()), 'unable to use shape validator if shape is already defined')
    assert(mightBeValidator(shapeValidator), 'bad validator provided')

    this[kOf] = shapeValidator

    return this
  }

  shape(shape) {
    assert(!this.getShapeValidator(), 'unable to define the shape if shape validator is already defined')

    ensureShapeIsValid(shape)

    this[kShape] = Object.assign(this.getShape(), shape)

    return this
  }

  extends(shapeOrSchema) {
    assert(!this.getShapeValidator(), 'unable to extend the shape if shape validator is already defined')

    const shape = resolveShape(shapeOrSchema)

    ensureShapeIsValid(shape)

    this[kShape] = softAssign(this.getShape(), shape)

    return this
  }

  getShape() {
    return this[kShape]
  }

  getShapeValidator() {
    return this[kOf]
  }
}

module.exports = SchemaValidator