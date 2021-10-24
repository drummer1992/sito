'use strict'

const { object, string } = require('../lib')

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
})