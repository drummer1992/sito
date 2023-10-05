'use strict'

const { object, string, check } = require('../lib')
const { isEmpty } = require('../lib/utils/predicates')

describe('assertBulk', () => {
  it('smoke', () => {
    const schema = object({ foo: string().required() }).strict()

    return assert.rejects(schema.assertBulk({ foo: 'bar', baz: 42 }), e => {
      assert.strictEqual(e.message, 'Bulk Validation Failed')
      assert.strictEqual(e.errors.length, 1)
      assert.strictEqual(e.errors[0].message, 'baz is forbidden attribute')

      return true
    })
  })

  it('should collect only one error per attribute', async () => {
      const schema = object({
          foo: string().required(),
          bar: check({
              validate: v => !isEmpty(v),
              message: 'bar should not be empty',
          })
              .check({
                  validate: v => v.banni,
                  message: 'bar.banni is empty',
              }),
      }).strict()

      await schema.assertBulk({ foo: '1', bar: { banni: true } })

      return assert.rejects(schema.assertBulk({ foo: 1, bar: 'null' }), e => {
          assert.strictEqual(e.errors.length, 2)
          assert.strictEqual(e.errors[0].message, 'foo should be type of string')
          assert.strictEqual(e.errors[1].message, 'bar should not be empty')

          return true
      })
  })
})