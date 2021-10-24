'use strict'

const { object, string } = require('../lib')

describe('validate', () => {
  it('smoke', async () => {
    const schema = object({ foo: string().required() }).strict()

    const errors = await schema.validate({ foo: 'bar', baz: 42 })

    assert.strictEqual(errors.length, 1)

    assert.deepEqual([{ ...errors[0] }], [{
      key: 'baz',
      path: 'baz',
      value: 42,
      message: 'baz is forbidden attribute',
      name: 'ValidationError',
    }])
  })
})