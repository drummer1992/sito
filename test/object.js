'use strict'

const { object, string } = require('../lib')

describe('object', () => {
  it('strict', () => {
    const schema = object({ foo: string().required() }).strict()

    return assert.rejects(
        schema.assert({ foo: 'bar', baz: 42 }),
        /baz is forbidden attribute/,
    )
  })

  it('of', () => {
    const schema = object(
        object({ name: string() }),
    )

    return assert.rejects(
        schema.assert({ foo: { name: 'john' }, bar: { name: 2 } }),
        /bar.name should be type of string/,
    )
  })
})