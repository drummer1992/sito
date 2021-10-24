'use strict'

const { object, array, number, string, boolean, oneOf, required, forbidden, check } = require('../lib')
const { GenericValidator, NumberValidator } = require('../lib')

describe('generic', () => {
  it('boolean', async () => {
    assert.strictEqual(await boolean().isValid(true), true)
  })

  it('oneOf', async () => {
    assert.strictEqual(await oneOf([1, 2]).isValid(1), true)
    assert.strictEqual(await oneOf([1, 2]).isValid(3), false)
  })

  it('required', async () => {
    assert.strictEqual(await required().isValid(null), false)
    assert.strictEqual(await required().isValid('foo'), true)
    assert.strictEqual(await required(false).isValid(null), true)
  })

  it('forbidden', () => {
    const schema = object({
      name: string(),
      gender: forbidden(),
    })

    return assert.rejects(
        schema.assert({ name: 'john', gender: 'm' }),
        /gender is forbidden attribute/,
    )
  })

  it('isValid', async () => {
    assert.strictEqual(await array([number()]).isValid(['ops']), false)
  })

  it('required method', async () => {
    const schema = string().required()

    await schema.assert('sito')
  })

  it('message', () => {
    const schema = string().message('custom message')

    return assert.rejects(schema.assert(5), /custom message/)
  })

  it('inheritance', () => {
    class DateValidator extends GenericValidator {
      constructor() {
        super()

        this.check({
          common: true,
          message: path => `${path} is not a date`,
          validate: value => new Date(value).toString() !== 'Invalid Date',
        })
      }

      inFuture() {
        return this.check({
          message: path => `${path} should be in future`,
          validate: value => new Date(value).getTime() > Date.now(),
        })
      }
    }

    const date = () => new DateValidator()

    const schema = object({
      dob: date().inFuture().required(),
    }).required()

    return assert.rejects(schema.assertBulk({ dob: 'not a date' }), e => {
      assert.strictEqual(e.errors.length, 2)
      assert.strictEqual(e.errors[0].message, 'dob is not a date')
      assert.strictEqual(e.errors[1].message, 'dob should be in future')

      return true
    })
  })

  it('check', () => {
    const secret = 'mankivka'

    const schema = object({
      secret: check({
        optional: false,
        message: (path, value, key) => `secret is not valid, path: ${path}, value: ${value}, key: ${key}`,
        validate: value => value === secret,
      }),
    })

    return assert.rejects(schema.assert({ secret: 'popivka' }),
        /secret is not valid, path: secret, value: popivka, key: secret/)
  })

  it('expand', () => {
    NumberValidator.expand({
      safe() {
        return this.check({
          validate: value => value < Number.MAX_SAFE_INTEGER,
          message: key => `${key} is not safe`,
        })
      },
    })

    return assert.rejects(number().safe().assert(Number.MAX_SAFE_INTEGER), /payload is not safe/)
  })

  it('combine', () => {
    const database = ['id1', 'id2']

    const userIdSchema = string().max(50).required()
        .combine(
            check({
              validate: value => database.includes(value),
              message: (path, value) => `user not found by id ${value}`,
            }),
        )

    return assert.rejects(userIdSchema.assert('killer228'), /user not found by id killer228/)
  })
})