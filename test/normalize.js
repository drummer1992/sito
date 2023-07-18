'use strict'

const { boolean, number, date, object, array } = require('../lib')

describe('normalize', () => {
  it('should normalize all attributes', async () => {
    const schema = object({
      a: boolean(),
      b: number(),
      c: object({
        d: date(),
        e: boolean(),
        g: array(),
      }),
    })

    const payload = {
      a: 'true',
      b: '5',
      c: {
        d: '1689670492966',
        e: 'false',
        g: 'foo',
      },
    }

    await schema.validate(payload, { normalize: true })

    assert.deepStrictEqual(payload, {
      a: true,
      b: 5,
      c: {
        d: new Date(1689670492966),
        e: false,
        g: ['foo'],
      },
    })
  })

  it('should normalize selected', async () => {
    const schema = object({
      a: boolean().normalize(),
      b: date().normalize(),
      c: number(),
    })

    const payload = {
      a: 'true',
      b: '1689670492966',
      c: '4',
    }

    await schema.validate(payload)

    assert.deepStrictEqual(payload, {
      a: true,
      b: new Date(1689670492966),
      c: '4',
    })
  })
})