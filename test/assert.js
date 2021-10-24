'use strict'

const { object, string } = require('../lib')

describe('assert', () => {
  it('smoke', () => {
    const schema = object({ foo: string().required() })

    return assert.rejects(schema.assert({}), /foo is required/)
  })
})