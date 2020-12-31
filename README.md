# FileDataStore [![NPM version][npm-image]][npm-url] [![Coverage Status][coverage-image]][npm-url]


[npm-image]:      https://img.shields.io/npm/v/filedatastore.svg
[coverage-image]: https://coveralls.io/repos/github/itsnikhil/filedatastore/badge.svg?branch=2.0
[npm-url]:        https://npmjs.org/package/filedatastore

## Introduction

> File-based key-value data store that supports the basic CRD (create, read, and delete) operations. This data store is meant to be used as a local storage for one single process on one machine.

## Installation

``` npm i filedatastore ```


## Usage
```js
import { DataStore } from 'filedatastore'

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
    expiry: // number (TTL in sec, optional)
});
response // Promise<string>
    .then(result => console.log(result))
    .catch(error => console.log(error))

// Output
$ Write complete! Saved to "./path/file.json"
```

#### Read Operation
```js
const response = dataStore.read('user'));
response // Promise<string>
    .then(result => console.log(JSON.parse(result)))
    .catch(error => console.log(error))

// Output
$ {name: "Nikhil Taneja", username: "itsNikhil", isAwesome: true}
```

#### Delete Operation
```js
const response = dataStore.data('user'));
response // Promise<string>
    .then(result => console.log(result))
    .catch(error => console.log(error))

// Output
$ Deleted!
```

## Tests

#### Unit tests
`npm run test`

#### Test lint
`npm run lint`

#### Test coverage
`npm run coverage`
