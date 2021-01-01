# FileKeyStore [![GitHub actions build][build-image]][github-url] [![NPM version][npm-image]][npm-url] [![Coverage Status][coverage-image]][npm-url]

[npm-image]:      https://img.shields.io/npm/v/filekeystore.svg
[build-image]:    https://github.com/itsnikhil/filekeystore/workflows/CI%20Pipeline/badge.svg
[build-image]:    https://github.com/itsnikhil/filekeystore/workflows/CI%20Pipeline/badge.svg
[coverage-image]: https://coveralls.io/repos/github/itsnikhil/filekeystore/badge.svg?branch=master
[npm-url]:        https://npmjs.org/package/filekeystore
[github-url]:     https://github.com/itsnikhil/filekeystore

## Introduction

> File-based key-value data store that supports the basic CRD (create, read, and delete) operations. This data store is meant to be used as a local storage for one single process on one machine.

## Installation

npm i filekeystore


## Usage
```js
// JavaScript
const { DataStore } = require('filekeystore')
// TypeScript
import { DataStore } from 'filekeystore'

dataStore = new DataStore(file="data", path=".") 
//path is optional and defaults to current working directory
```

#### Create Operation
```js
const response = dataStore.create({
    key: 'user', // string (max 32 characters)
    value: { // object (cannot be empty and less than 16KB in size)
        name: 'Nikhil Taneja',
        username: 'itsNikhil',
        isAwesome: true
    },
    expiry: 3 // number (TTL in sec, optional)
});
response // Promise<string>
    .then(result => console.log(result))
    .catch(error => console.log(error))

// Output
$ Write complete! Saved to "/path/file.json"
```

#### Read Operation
```js
const response = dataStore.read('user');
response // Promise<string>
    .then(result => console.log(JSON.parse(result)))
    .catch(error => console.log(error))

// Output
$ {name: "Nikhil Taneja", username: "itsNikhil", isAwesome: true}
```

#### Delete Operation
```js
const response = dataStore.delete('user');
response // Promise<string>
    .then(result => console.log(result))
    .catch(error => console.log(error))

// Output
$ Deleted!
```

## Tests

**Unit tests**
> npm run test
```py
> mocha -r ts-node/register tests/**/*.test.ts

  DataStore Create Tests:
    √ should initialise with correct filepath
    √ should write data to file
    √ should write data to file with TTL     
    √ should reject create operation if key already exists        
    √ should reject create operation if key length greater than 32

  DataStore Delete Tests:
    √ should reject delete operation if key not found
    √ should delete data if key exists

  DataStore Read Tests:
    √ should return data if key exists
    √ should return data before TTL expire
    √ should reject read operation if key not found
    √ should reject read operation if TTL expires (1502ms)

  11 passing (2s)
```

**Test lint**
> npm run lint

**Test coverage**
> npm run coverage
---
