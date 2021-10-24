'use strict'

exports.expandPrototype = (prototype, obj) => {
  for (const [name, method] of Object.entries(obj)) {
    Object.defineProperty(prototype, name, {
      value: method,
      writable: true,
    })
  }
}