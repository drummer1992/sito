'use strict'

const { GenericValidator, object, string, number, interceptor, compose } = require('../lib')

describe('interceptor', () => {
  before(() => {
    GenericValidator.expand({
      asWarning() {
        this.warning = true

        return this
      },

      reference(ref) {
        const check = this.checks.last()

        check.reference = ref

        return this
      },
    })

    interceptor.onError((error, options) => {
      const { validator, prefix, check } = options

      if (prefix) {
        error.message = `${prefix} ${error.message}`
      }

      if (validator.warning) {
        return console.warn(error)
      }

      if (check.reference) {
        error.reference = check.reference
      }

      return error
    })

    interceptor.onBulkError((error, options) => {
      if (options.bulkErrorClazz) {
        error = new options.bulkErrorClazz(error.errors)
      }

      return error
    })
  })

  describe('onError', () => {
    it('asWarning functionality', async () => {
      const schema = object({
        name: string().required().asWarning(),
        age: number().required().asWarning(),
      }).required()

      await schema.assert({ name: 5, age: '23' })
    })

    it('prefix functionality', () => {
      return assert.rejects(
          string().required().assert(undefined, { prefix: 'OOPS.' }),
          /OOPS\. payload is required/,
      )
    })
  })

  describe('onBulkError', () => {
    class CustomError extends Error {
      constructor(errors) {
        super()

        this.errors = errors
      }
    }

    it('bulkErrorClass', () => {
      return assert.rejects(
          string().required().assertBulk(5, { bulkErrorClazz: CustomError }),
          error => {
            assert(error instanceof CustomError)

            assert.strictEqual(error.errors.length, 1)
            assert.strictEqual(error.errors[0].message, 'payload should be type of string')

            return true
          },
      )
    })
  })

  describe('compose', () => {
    it('should respect top level validator', async () => {
      await compose(
          string().required(),
          string().required(),
      ).asWarning().assert()
    })

    it('reference', () => {
      const composedSchema = compose(
          string().required().reference('1'),
          string().required().reference('2'),
          string().required().reference('3'),
      )

      return assert.rejects(
          composedSchema.assertBulk(),
          error => {
            assert(error)

            assert.strictEqual(error.errors.length, 3)
            assert.strictEqual(error.errors[0].reference, '1')
            assert.strictEqual(error.errors[1].reference, '2')
            assert.strictEqual(error.errors[2].reference, '3')

            return true
          },
      )
    })
  })
})