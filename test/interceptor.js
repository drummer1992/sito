'use strict'

const { GenericValidator, object, string, number, interceptor } = require('../lib')

describe('interceptor', () => {
  before(() => {
    GenericValidator.expand({
      asWarning() {
        this.checks.extra.asWarning = true

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
})