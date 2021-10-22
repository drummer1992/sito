# tak

tak is a lightweight schema validator built without any dependencies. 

## Usage

Define a validator, validate the object, array or any scalar values.
The schema definition is extremely declarative that allows building complex schemas of interdependent validators.

```js
const { object, array, number, string } = require('tak')

const objectSchema = object({
  foo: object({
    bar: number()
  }),
 })

await objectSchema.assert({ 
  foo: {
    bar: 'a',
   },
 }) // throws error with message => foo.bar should be a number

const arraySchema = array([
  string(),
  number(),
])

await arraySchema.assert([
  'foo',
  'bar',
]) // throws error with message => [1] should be a number

const arrayOfValidatorsSchema = array(string())

await arrayOfValidatorsSchema.assert([
  'foo',
  'bar',
  'baz',
  42,
]) // throws error with message => [3] should be type of string

const mapOfValidatorsSchema = object(
    object({
      name: string().required(),
      age: number().required(),
    }),
)

await mapOfValidatorsSchema.assert({
  john: { name: 'john', age: 28 },
  pit: { name: 'pit' },
}) // pit.age is required
```

The exported functions are factory methods of validators:
```js
const {
  required,
  boolean,
  forbidden,
  oneOf,
  string,
  object,
  array,
} = require('tak')
```

If you need the validator classes, they are also exported:

```js
const {
  GenericValidator,
  StringValidator,
  SchemaValidator,
  ObjectValidator,
  ArrayValidator,
} = require('tak')
```

## API

- `tak`
  - [`ValidationError(message: string, value: any, path: string)`](#validationerrormessage-string-value-any-path-string)
  - [`BulkValidationError(errors: ValidationError[])`](#bulkvalidationerrorerrors-validationerror)
  - [GenericValidator](#generic)
    - [`validator.assert(payload: any, { bulk: boolean, strict: boolean }): Promise<void>`](#validatorassertpayload-any--bulk-boolean-strict-boolean--promisevoid)
    - [`validator.validate(payload: any, { strict: boolean }): Promise<ValidationError[]>`](#validatorvalidatepayload-any--strict-boolean--promisevalidationerror)
    - [`validator.required(isRequired?: boolean): GenericValidator`](#validatorrequiredisrequired-boolean-genericvalidator)
    - [`validator.message(message?: string | function): GenericValidator`](#validatormessagemessage-string--function-genericvalidator)
    - [`validator.addCheck({ message: string | function, validate: function }): GenericValidator`](#validatoraddcheck-message-string--function-validate-function--genericvalidator)
    - [`validator.combine(validators: GenericValidator[]): GenericValidator`](#validatorcombinevalidators-genericvalidator-genericvalidator)
  - [StringValidator](#string)
    - [`string.length(limit: number): StringValidator`](#stringlengthlimit-number-stringvalidator)
    - [`string.min(limit: number): StringValidator`](#stringminlimit-number-stringvalidator)
    - [`string.max(limit: number): StringValidator`](#stringmaxlimit-number-stringvalidator)
  - [NumberValidator](#number)
    - [`number.min(limit: number): NumberValidator`](#numberminlimit-number-numbervalidator)
    - [`number.max(limit: number): NumberValidator`](#numbermaxlimit-number-numbervalidator)
    - [`number.positive(): NumberValidator`](#numberpositive-numbervalidator)
    - [`number.negative(): NumberValidator`](#numbernegative-numbervalidator)
  - [ArrayValidator](#array)
    - [`array.of(itemValidator: GenericValidator): ArrayValidator`](#arrayofiremvalidator-genericvalidator-arrayvalidator)
    - [`array.shape(arr: Array): ArrayValidator`](#arrayshapearr-array-arrayvalidator)
  - [ObjectValidator](#object)
    - [`object.of(itemValidator: GenericValidator): ObjectValidator`](#objectofitemvalidator-genericvalidator-objectvalidator)
    - [`object.shape(obj: Array): ObjectValidator`](#objectshapeobj-object-objectvalidator)
  - [boolean](#boolean)
  - [oneOf](#oneof)
  - [required](#required)
  - [forbidden](#forbidden)

#### `ValidationError(message: string, value: any, path: string)`

Thrown on failed validations, with the following properties

- `name`: "ValidationError"
- `path`: a string, indicates where the error thrown. `path` is equal `payload` at the root level.
- `message`: error message

#### `BulkValidationError(errors: ValidationError[])`

Thrown on failed validations, with the following properties

- `name`: "BulkValidationError"
- `errors`: An array of ValidationError instances
- `message`: "Bulk Validation Failed"

#### `generic`

Define a generic validator.

### `validator.assert(payload: any, { bulk: boolean, strict: boolean }): Promise<void>`

```js
const { string } = require('tak')

const schema = object({ foo: string().required() })

await schema.assert({}) // throws error with message => foo is required
```

A strict flag makes the schema strict, it means that each attribute that is not defined in the schema will be rejected

```js
const { string } = require('tak')

const schema = object({ foo: string().required() })

await schema.assert({ foo: 'bar', baz: 42 }, { strict: true }) // throws error with message => baz is forbidden attribute
```

Bulk flag forces to validate the whole payload and collect errors, if there are some errors, BulkValidationError will be thrown

```js
const { string } = require('tak')

const schema = object({ foo: string().required() })

await schema.assert({ foo: 'bar', baz: 42 }, { bulk: true, strict })
 
// throws error => { message: 'Bulk Validation Failed', errors: [{ message: 'baz is forbidden attribute', path: 'baz', value: 42 }] } 
```
 

### `validator.validate(payload: any, { strict: boolean }): Promise<ValidationError[]>`

Validate method performs validation and returns an array of the errors

```js
const { string } = require('tak')

const schema = object({ foo: string().required() })

await schema.validate({ foo: 'bar', baz: 42 }, { bulk: true, strict })
 
// returns => [{ message: 'baz is forbidden attribute', path: 'baz', value: 42 }] 
```

#### `validator.required(isRequired?: boolean): GenericValidator`

```js
const { string } = require('tak')

const schema = string().required()

await schema.assert('tak') // => ok
```

#### `validator.message(message?: string | function): GenericValidator`

```js
const { string } = require('tak')

const schema = string().message('custom message')

await schema.assert(5) // => custom message
```

Message method takes function as well:

```js
const { string, object } = require('tak')

const schema = object({
  foo: string().message(path => `${path} is not valid`)
})

await schema.assert({ foo: 5 }) // => foo is not valid
```

### `validator.addCheck({ message: string | function, validate: function }): GenericValidator`

You can enrich validator with custom check usee `addCheck` method

```js
const { string, object } = require('tak')

const schema = object({
  foo: string().addCheck({
    message: path => `${path} is not valid`,
    validate: value => value === 'secret',
  })
})

await schema.assert({ foo: 5 }) // => foo is not valid
```

This may also be required if you need to expanding the validator prototype

```js
NumberValidator.expand({
  safe() {
    return this.addCheck({
      validate: value => value < Number.MAX_SAFE_INTEGER,
      message: key => `${key} is not safe`,
    })
  },
})
```

### `validator.combine(validators: GenericValidator[]): GenericValidator`

It might be useful if you need to merge validators

```js
const userIdSchema = string().max(50).required()
    .combine(
      new GenericValidator()
        .addCheck({
          validate: value => User.exists({ where: { id: value } }),
          message: (path, value) => `User not found by id ${value}`,
        })
    )
```


### string

Define a string validator.

```js
await string().assert('tak') // => ok
```

#### `string.length(limit: number): StringValidator`

Set an expected length for the string.

#### `string.min(limit: number): StringValidator`

Set min expected length for the string.

#### `string.max(limit: number): StringValidator`

Set max expected length for the string.

#### `string.pattern(regex: Regex): StringValidator`

Takes a regex pattern to check the string.

```js
await string().pattern(/(foo|bar)/).isValid('foo') // => true
await string().pattern(/(foo|bar)/).isValid('baz') // => false
```

### number

Define a number validator.

```js
await number().isValid(10) // => true
```

#### `number.min(limit: number): NumberValidator`

Set the minimum value allowed.

#### `number.max(limit: number): NumberValidator`

Set the maximum value allowed.

#### `number.positive(): NumberValidator`

Value must be a positive number.

#### `number.negative(): NumberValidator`

Value must be a negative number.

### array

Define an array validator.

```js
const schema = array().of(string().min(2))

await schema.isValid(['ab', 'abc']) // => true
await schema.isValid(['ab', 'a']) // => false
```

#### `array.of(iremValidator: GenericValidator): ArrayValidator`

You can also pass a subtype schema to the array constructor.

```js
array().of(number())
// or
array(number())
```

### `array.shape(arr: Array): ArrayValidator`

You can also define shape for the array validator.

```js
array().shape([number()])
// or
array([number()])
```


### object

```js
object({
  name: string().required(),
  age: number().required().positive(),
})
```

#### `object.shape(obj: object): ObjectValidator`

You can also pass a shape to the object constructor.

```js
object().shape({
  num: number(),
})
// or
object({
  num: number(),
})
```

#### `object.of(itemValidator: GenericValidator): ObjectValidator`

You can also pass a validator to the object constructor.

```js
object().of(number())
// or
object(number())
```

Example of use case
```js
    const schema = object(
      object({ name: string() })
    )

    await schema.assert({
      foo: { name: 'john' },
      bar: { name: 'doe' },
    })
```

### boolean

Define a boolean validator.

```js
await boolean().isValid(true) // => true
```

### oneOf

Define a oneOf validator.

```js
await oneOf([1, 2]).isValid(1) // => true
await oneOf([1, 2]).isValid(3) // => false
```

### required

Define a required validator.

```js
await required().isValid(null) // => false
await required().isValid('foo') // => true
```

Method takes flag `isRequired` so you can disable such validator on fly.

```js
await required(false).isValid(null) // => true
```

### forbidden

Define a forbidden validator.

```js
await object({
  name: string(),
  gender: forbidden(),
}).assert({ name: 'john', gender: 'm' }) // throws => gender is forbidden attribute
```