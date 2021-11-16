'use strict'

const { GenericValidator, object, string, number, interceptor, compose } = require('../lib')

describe('interceptor', () => {
  before(() => {
    GenericValidator.expand({
      asWarning() {
        this.extra.asWarning = true

        return this
      },

      reference(ref) {
        this.extra.reference = ref

        return this
      },
    })

    interceptor.onError((error, options) => {
      if (options.prefix) {
        error.message = `${options.prefix} ${error.message}`
      }

      if (options.extra.asWarning) {
        return console.warn(error)
      }

      if (options.extra.reference) {
        error.reference = options.extra.reference
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
    it('each validator should be independent', async () => {
      await compose(
          string().required().asWarning(),
          string().required().asWarning(),
      ).assert()

      await assert.rejects(compose(
          string().required().asWarning(),
          string().required(),
      ).assert(), /payload is required/)
    })

    it('each validator should have own `extra` object', () => {
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