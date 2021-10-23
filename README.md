# Sito

Sito is a JavaScript lightweight schema validator built without any dependencies. 
The API is heavily inspired by [Yup](https://github.com/jquense/yup).

## Usage

Define a validator, validate the object, array or any scalar values.
The schema definition is extremely declarative that allows building complex schemas of interdependent validators.

```js
import { object, array, number, string } from 'sito'

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
import {
  required,
  boolean,
  forbidden,
  oneOf,
  string,
  object,
  array,
} from 'sito'
```

If you need the validator classes, they are also exported:

```js
import {
  GenericValidator,
  StringValidator,
  SchemaValidator,
  ObjectValidator,
  ArrayValidator,
} from 'sito'
```

## API

- `Sito`
  - [`ValidationError(message: string, value: any, path: string, key: string)`](#validationerrormessage-string-value-any-path-string-key-string)
  - [`BulkValidationError(errors: ValidationError[])`](#bulkvalidationerrorerrors-validationerror)
  - [GenericValidator](#generic)
    - [`validator.assert(payload: any): Promise<void>`](#validatorassertpayload-any-promisevoid)
    - [`validator.assertBulk(payload: any): Promise<void>`](#validatorassertbulkpayload-any-promisevoid)
    - [`validator.validate(payload: any): Promise<ValidationError[]>`](#validatorvalidatepayload-any-promisevalidationerror)
    - [`validator.isValid(payload: any): Promise<Boolean>`](#validatorisvalidpayload-any-promiseboolean)
    - [`validator.required(isRequired?: boolean): GenericValidator`](#validatorrequiredisrequired-boolean-genericvalidator)
    - [`validator.message(message: string | function(path: string, value: any, key: string|void): string): GenericValidator`](#validatormessagemessage-string--functionpath-string-value-any-key-stringvoid-string-genericvalidator)
    - [`validator.addCheck({ message: string | function(path: string, value: any, key: string|void): string|string, validate: function(value: any): boolean|Promise<boolean> }, { optional?: true, common?: false }): GenericValidator`](#validatoraddcheck-message-string--functionpath-string-value-any-key-stringvoid-stringstring-validate-functionvalue-any-booleanpromiseboolean---optional-true-common-false--genericvalidator)
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
    - [`array.strict(isStrict?: boolean): ArrayValidator`](#arraystrictitemvalidator-genericvalidator-arrayvalidator)
    - [`array.of(itemValidator: GenericValidator): ArrayValidator`](#arrayofiremvalidator-genericvalidator-arrayvalidator)
    - [`array.shape(arr: Array): ArrayValidator`](#arrayshapearr-array-arrayvalidator)
  - [ObjectValidator](#object)
    - [`object.strict(isStrict?: boolean): ObjectValidator`](#objectstrictitemvalidator-genericvalidator-objectvalidator)
    - [`object.of(itemValidator: GenericValidator): ObjectValidator`](#objectofitemvalidator-genericvalidator-objectvalidator)
    - [`object.shape(obj: Array): ObjectValidator`](#objectshapeobj-object-objectvalidator)
  - [boolean](#boolean)
  - [oneOf](#oneof)
  - [required](#required)
  - [forbidden](#forbidden)

#### `ValidationError(message: string, value: any, path: string, key: string)`

Thrown on failed validations, with the following properties

- `name`: "ValidationError"
- `path`: a string, indicates where the error thrown. `path` is equal to `payload` at the root level.
- `key`: a string, indicates property key.
- `message`: error message

#### `BulkValidationError(errors: ValidationError[])`

Thrown on failed validations, with the following properties

- `name`: "BulkValidationError"
- `errors`: An array of ValidationError instances
- `message`: "Bulk Validation Failed"

#### `generic`

Define a generic validator.

### `validator.assert(payload: any): Promise<void>`

```js
const schema = object({ foo: string().required() })

await schema.assert({}) // throws error with message => foo is required
```

### `validator.assertBulk(payload: any): Promise<void>`

`assertBulk` method forces to validate the whole payload and collect errors, if there are some errors, BulkValidationError will be thrown

```js
const schema = object({ foo: string().required() }).strict()

await schema.assertBulk({ foo: 'bar', baz: 42 })
 
// throws error => { message: 'Bulk Validation Failed', errors: [{ message: 'baz is forbidden attribute', path: 'baz', value: 42 }] } 
```
 

### `validator.validate(payload: any): Promise<ValidationError[]>`

`validate` method performs validation and returns an array of the errors

```js
const schema = object({ foo: string().required() }).strict()

await schema.validate({ foo: 'bar', baz: 42 })
 
// returns => [{ message: 'baz is forbidden attribute', path: 'baz', value: 42 }] 
```

### `validator.isValid(payload: any): Promise<Boolean>`

`isValid` method performs validation and returns `true` in case of successful validation, otherwise `false`

```js
await array([number()]).isValid(['ops']) // false 
```

#### `validator.required(isRequired?: boolean): GenericValidator`

```js
const schema = string().required()

await schema.assert('sito') // => ok
```

#### `validator.message(message?: string | function(path: string, value: any, key: string|void): string): GenericValidator`

Set custom `message`:

```js
const schema = string().message('custom message')

await schema.assert(5) // => custom message
```

`message` method takes function as well:

```js
const schema = object({
  foo: string().message(path => `${path} is not valid`)
})

await schema.assert({ foo: 5 }) // => foo is not valid
```

### `validator.addCheck({ message: string | function(path: string, value: any, key: string|void): string|string, validate: function(value: any): boolean|Promise<boolean> }, { optional?: true, common?: false }): GenericValidator`

You can enrich validator with custom check using `addCheck` method, 
please note that each check is `optional` by default,
it means that the validation won't run if the value isn't defined.
It takes `common` flag also (`false` by default) which need to force the validator to perform each validate call with such check,
note that the `common` flag can only be defined once,
`common` flag might be useful when you need to create custom validator, 
for example we need to check that the provided value is a `Date` for each DateValidator check.

```js
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
  dob: date().inFuture().required()
}).required()

await schema.assert({ dob: 'not a date' }) // => foo is not a date
await schema.assert({ dob: 5 }) // => foo should be in future
```

This may also be required if you need to expand the validator's prototype

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
await string().assert('sito') // => ok
```

#### `string.length(limit: number): StringValidator`

Set the expected length for the string.

#### `string.min(limit: number): StringValidator`

Set the minimum expected length for the string.

#### `string.max(limit: number): StringValidator`

Set the maximum expected length for the string.

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

### `array.strict(isStrict?: boolean): ArrayValidator`

A `strict` method makes the schema strict or no, it means that each attribute that is not defined in the schema will be rejected


```js
const schema = array([string().required()]).strict()

await schema.assert(['foo', 'bar']) // throws error with message => [1] is forbidden attribute
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

Define object validator.

```js
object({
  name: string().required(),
  age: number().required().positive(),
})
```

### `object.strict(isStrict?: boolean): ObjectValidator`

A `strict` method makes the schema strict or no, it means that each attribute that is not defined in the schema will be rejected

```js
const schema = object({ foo: string().required() }).strict()

await schema.assert({ foo: 'bar', baz: 42 }) // throws error with message => baz is forbidden attribute
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

Method takes flag `isRequired` so you can disable such validator on the fly.

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