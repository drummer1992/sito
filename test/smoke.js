'use strict'

const { object, array, number, string, boolean, oneOf, required, forbidden } = require('../lib')
const { GenericValidator, NumberValidator } = require('../lib')

describe('sito', () => {
  describe('shape validation', () => {
    describe('object validation', () => {
      it('check type', () => {
        return assert.rejects(object().assert(1), /payload should be type of object/)
      })

      it('required', () => {
        return assert.rejects(object().required().assert(), /payload is required/)
      })

      it('not empty', () => {
        return assert.rejects(object().notEmpty().assert({}), /payload should be not empty object/)
      })

      describe('nested validation', () => {
        const schema = object({
          foo: object({
            bar: object({
              baz: object({
                n: string()
                    .required(false)
                    .message('custom message that will not show')
                    .notEmpty(),
              }).required(),
            }).required(),
          }).required(),
        }).required()

        it('smoke', async () => {
          await assert.rejects(schema.assert({}), /foo is required/)
          await assert.rejects(schema.assert({ foo: {} }), /foo\.bar is required/)
          await assert.rejects(schema.assert({ foo: { bar: {} } }), /foo\.bar\.baz is required/)

          await assert.rejects(
              schema.assert({ foo: { bar: { baz: { n: 5 } } } }),
              /foo\.bar\.baz\.n should be type of string/,
          )

          await assert.rejects(
              schema.assertBulk({ foo: { bar: { baz: { n: 5 } } } }),
              error => {
                assert.strictEqual(error.message, 'Bulk Validation Failed')

                return true
              },
          )
        })
      })

      describe('map', () => {
        const schema = object(
            object({
              name: string().required(),
              age: number().required(),
            })
                .notEmpty()
                .required(),
        )
            .required()
            .notEmpty()

        it('smoke', async () => {
          await assert.rejects(schema.assert({ id1: '' }), /id1 should be type of object/)
          await assert.rejects(schema.assert({ id1: { foo: '' } }), /id1\.name is required/)
          await assert.rejects(schema.assert({ id1: { name: 'Andrii' } }), /id1\.age is required/)

          await assert.rejects(schema.assert({
            id1: { name: 'Andrii', age: 28 },
            id2: { name: 'Max', age: {} },
          }), /id2\.age should be a number/)

          await schema.assert({
            id1: { name: 'Andrii', age: 28 },
            id2: { name: 'Max', age: 29 },
          })
        })
      })
    })

    describe('array validation', () => {
      it('check type', () => {
        return assert.rejects(array().assert(1), /payload should be type of array/)
      })

      it('required', () => {
        return assert.rejects(array().required().assert(), /payload is required/)
      })

      it('not empty', () => {
        return assert.rejects(array().notEmpty().assert([]), /payload should be not empty array/)
      })

      it('shape', () => {
        return assert.rejects(array([
          string().required(),
        ]).required().assert([]), /\[0] is required/)
      })

      describe('nested validation', () => {
        const schema = array(
            object({
              foo: object({
                bar: object({
                  baz: object({
                    n: array(number().required()).notEmpty().required(),
                  }).strict().required(),
                }).strict().required(),
              }).strict().required(),
            }).strict(),
        ).strict().required().notEmpty()

        it('smoke', async () => {
          const validItem = { foo: { bar: { baz: { n: [5] } } } }

          await assert.rejects(schema.assert({}), /payload should be type of array/)
          await assert.rejects(schema.assert([{}]), /foo is required/)
          await assert.rejects(schema.assert([{ foo: {} }]), /\[0]\.foo.bar is required/)
          await assert.rejects(schema.assert([{ foo: { bar: {} } }]), /\[0]\.foo\.bar\.baz is required/)
          await assert.rejects(schema.assert([{ foo: { bar: { baz: {} } } }]), /\[0]\.foo\.bar\.baz\.n is required/)

          await assert.rejects(
              schema.assert([{ foo: { bar: { baz: { n: [] } } } }]),
              /\[0]\.foo\.bar\.baz\.n should be not empty array/,
          )

          await assert.rejects(
              schema.assert([{ foo: { bar: { baz: { n: [{}] } } } }]),
              /\[0]\.foo\.bar\.baz\.n\[0] should be a number/,
          )

          const errors = await schema.validate([{ foo: { bar: { baz: { n: ['asdo'] } } } }])

          assert.strictEqual(errors.length, 1)
          assert.strictEqual(errors[0].message, '[0].foo.bar.baz.n[0] should be a number')

          await schema.assert([validItem])

          assert.deepStrictEqual(await schema.validate([validItem]), [])

          await assert.rejects(schema.assert([validItem, { foo: {} }]), /\[1]\.foo.bar is required/)
          await assert.rejects(schema.assert([validItem, { foo: { bar: {} } }]), /\[1]\.foo\.bar\.baz is required/)

          await assert.rejects(
              schema.assert([validItem, { ...validItem, name: 'foo' }]),
              /\[1]\.name is forbidden attribute/,
          )

          await assert.rejects(
              schema.assert([validItem, { foo: { bar: { baz: {} } } }]),
              /\[1]\.foo\.bar\.baz\.n is required/,
          )

          await assert.rejects(
              schema.assert([validItem, { foo: { bar: { baz: { n: [] } } } }]),
              /\[1]\.foo\.bar\.baz\.n should be not empty array/,
          )

          await assert.rejects(
              schema.assert([validItem, { foo: { bar: { baz: { n: [{}] } } } }]),
              /\[1]\.foo\.bar\.baz\.n\[0] should be a number/,
          )

          await schema.assert([validItem, validItem])
        })
      })
    })
  })

  describe('unit validation', () => {
    it('required', () => {
      return assert.rejects(string().required().assert(), /payload is required/)
    })
  })

  describe('examples', () => {
    describe('assert', () => {
      it('smoke', () => {
        const schema = object({ foo: string().required() })

        return assert.rejects(schema.assert({}), /foo is required/)
      })
    })

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

    describe('array', () => {
      it('smoke', async () => {
        const schema = array().of(string().min(2))

        assert.strictEqual(await schema.isValid(['ab', 'abc']), true)
        assert.strictEqual(await schema.isValid(['ab', 'a']), false)
      })

      it('strict', () => {
        const schema = array([string().required()]).strict()

        return assert.rejects(
            schema.assert(['foo', 'bar']),
            /\[1] is forbidden attribute/,
        )
      })
    })

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

    describe('string', () => {
      it('smoke', async () => {
        await string().assert('sito')
      })

      it('pattern', async () => {
        await string().pattern(/(foo|bar)/)

        assert.strictEqual(await string().pattern(/(foo|bar)/).isValid('baz'), false)
      })
    })

    describe('number', () => {
      it('smoke', async () => {
        assert.strictEqual(await number().isValid(10), true)
      })
    })

    describe('other', () => {
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

      it('inheritance', async () => {
        class DateValidator extends GenericValidator {
          constructor() {
            super()

            this.addCheck({
              message: path => `${path} is not a date`,
              validate: value => new Date(value).toString() !== 'Invalid Date',
            }, { common: true })
          }

          inFuture() {
            return this.addCheck({
              message: path => `${path} should be in future`,
              validate: value => new Date(value).getTime() > Date.now(),
            })
          }
        }

        const date = () => new DateValidator()

        const schema = object({
          dob: date().inFuture().required(),
        }).required()

        await assert.rejects(schema.assert({ dob: 'not a date' }), /dob is not a date/)
        await assert.rejects(schema.assert({ dob: 5 }), /dob should be in future/)
      })

      it('expand', () => {
        NumberValidator.expand({
          safe() {
            return this.addCheck({
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
                new GenericValidator()
                    .addCheck({
                      validate: value => database.includes(value),
                      message: (path, value) => `user not found by id ${value}`,
                    }, { optional: false }),
            )

        return assert.rejects(userIdSchema.assert('killer228'), /user not found by id killer228/)
      })
    })
  })
})