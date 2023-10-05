'use strict'

const { object, array, number, string, boolean, oneOf, required, check, combine } = require('../lib')
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

  it('forbidden', async () => {
    const MALE = 'm'
    const FEMALE = 'f'

    const schema = object({
      name: string(),
      gender: oneOf([FEMALE, MALE]),
      age: (value, key, obj) => number()
          .min(18)
          .forbidden(obj.gender === FEMALE)
          .message('It is not decent to ask a woman about her age 8)'),
    })

    await schema.assert({ name: 'Tolya', gender: 'm', age: 41 })

    await assert.rejects(
        schema.assert({ name: 'john', gender: 'f', age: 38 }),
        /It is not decent to ask a woman about her age 8\)/,
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
      assert.strictEqual(e.errors[0].message, 'dob is not a date')

      return true
    })
  })

  it('check', async () => {
    const secret = 'mankivka'

    const schema = object({
      secret: check({
        optional: false,
        message: (path, value, key) => `secret is not valid, path: ${path}, value: ${value}, key: ${key}`,
        validate: value => value === secret,
      }),
    })

    await assert.rejects(schema.assert({ secret: 'popivka' }),
        /secret is not valid, path: secret, value: popivka, key: secret/)

    await assert.rejects(
        check({ validate: false, message: 'not valid' }).assert('foo'),
        /not valid/,
    )
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

  describe('combine', () => {
    it('method', () => {
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

    it('factory', () => {
      const database = ['id1', 'id2']

      const userIdSchema = combine(
          string().max(50).required(),
          check({
            validate: value => database.includes(value),
            message: (path, value) => `user not found by id ${value}`,
          }),
      )

      return assert.rejects(userIdSchema.assert('killer228'), /user not found by id killer228/)
    })
  })

  describe('transform', () => {
    it('smoke', async () => {
      const helper = {
        dubai: 'Dubai',
      }

      const schema = array(
          object({
            city: object({
              name: () => oneOf(['Dubai', 'Kyiv']).required().transform(v => helper[v] || v),
            }).required(),
          }),
      )

      await assert.rejects(schema.assert([{}]), /\[0].city is required/)
      await assert.rejects(schema.assert([{ city: { name: 'Mankivka' } }]), /\[0].city.name should be one of/)

      await schema.assert([{ city: { name: 'Dubai' } }])

      const payload = [{ city: { name: 'dubai' } }]

      await schema.assert(payload)

      assert.deepStrictEqual(payload, [{ city: { name: 'Dubai' } }])
    })

    it('should not enrich payload with undefined values', async () => {
      const payload = {}

      await object({
        key: string().transform(() => undefined),
      }).assert(payload)

      assert.deepStrictEqual(payload, {})
    })

    it('should respect undefined in case payload has own property', async () => {
      const payload = { key: null }

      await object({
        key: string().transform(() => undefined),
      }).assert(payload)

      assert.deepStrictEqual(payload, { key: undefined })
    })

    it('should set default value', async () => {
      const payload = { a: null, b: 'bar' }

      await object({ a: string().default('foo'), b: string() }).assert(payload)

      assert.deepStrictEqual(payload, { a: 'foo', b: 'bar' })
    })
  })
})