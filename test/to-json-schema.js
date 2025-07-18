'use strict'

const { object, array, number, string, boolean, date } = require('../lib')

describe('toJSONSchema', () => {
  it('array', () => {
    const schema = array(string()).notEmpty().required()

    const jsonSchema = schema.toJsonSchema()

    assert.deepStrictEqual(jsonSchema, {
      type: 'array',
      minItems: 1,
      items: { type: 'string' },
    })
  })

  it('required on object level', () => {
    const schema = object({
      biz: object({
        baz: object({
          boz: number().required(),
        }).required(),
      }).required(),
    }).required()

    const jsonSchema = schema.toJsonSchema()

    assert.deepStrictEqual(jsonSchema, {
      type: 'object',
      required: ['biz'],
      properties: {
        biz: {
          type: 'object',
          required: ['baz'],
          properties: {
            baz: {
              type: 'object',
              properties: {
                boz: { type: 'number' },
              },
              required: ['boz'],
            },
          },
        },
      },
    })
  })

  it('smoke', () => {
    const schema = object({
      foo: string().required(),
      bar: number(),
      baz: array(string().min(1).max(3)).notEmpty().required(),
      biz: object({
        baz: object({
          boz: number().required(),
        }).required(),
      }).required(),
      des: boolean(),
      sub: date(),
    })

    const jsonSchema = schema.toJsonSchema()

    assert.deepStrictEqual(jsonSchema, {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        bar: { type: 'number' },
        baz: {
          type: 'array',
          minItems: 1,
          items: { type: 'string' },
        },
        biz: {
          type: 'object',
          required: ['baz'],
          properties: {
            baz: {
              type: 'object',
              properties: {
                boz: { type: 'number' },
              },
              required: ['boz'],
            },
          },
        },
        des: { type: 'boolean' },
        sub: { type: 'string', format: 'date-time' },
      },
      required: ['foo', 'baz', 'biz'],
    })
  })

  it('description', () => {
    const schema = object({
      foo: string().required().description('A string field'),
      bar: number().description('A number field'),
    }).description('A test object')

    const jsonSchema = schema.toJsonSchema()

    assert.deepStrictEqual(jsonSchema, {
      type: 'object',
      description: 'A test object',
      properties: {
        foo: {
          type: 'string',
          description: 'A string field',
        },
        bar: {
          type: 'number',
          description: 'A number field',
        },
      },
      required: ['foo'],
    })
  })
})
