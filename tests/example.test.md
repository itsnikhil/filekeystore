//
// Author: Nikhil Taneja (taneja.nikhil03@gmail.com)
// example.test.ts (c) 2020
// Desc: description
// Created:  Thu Dec 31 2020 00:12:25 GMT+0530 (India Standard Time)
// Modified: Thu Dec 31 2020 20:05:23 GMT+0530 (India Standard Time)
//

import { DataStore } from '../src/index';
import { expect } from 'chai';
import { resolve as abspath } from 'path';
import { after } from 'mocha';
import { unlink } from 'fs';

describe('DataStore Create Tests', () => {

  let dataStore: DataStore;
  before(() => {
    dataStore = new DataStore('create');
  })

  it('should initialise with correct filepath', () => {
    expect(dataStore.filepath).to.equal(abspath('./create.json'));
  })
  it('should write data to file', () => {
    return dataStore
      .create({
        key: 'item',
        value: {
          a: 1,
          b: 2,
        }
      })
      .then((data) => {
        expect(data).to.equal(`Write complete! Saved to "${dataStore.filepath}"`);
      })
  })
  it('should write data to file with TTL', () => {
    return dataStore
      .create({
        key: 'temp_item',
        value: {
          a: 1,
          b: 2,
        },
        expiry: 3
      })
      .then((data) => {
        expect(data).to.equal(`Write complete! Saved to "${dataStore.filepath}"`);
      })
  })
  it('should reject create operation if key already exists', (done) => {
    dataStore
      .create({
        key: 'item',
        value: {
          a: 1,
          b: 2
        }
      })
      .then(() => done(new Error('Expected method to reject.')))
      .catch((error: Error) => {
        expect(error.message).to.equal(`Could not create as data for "item" already exists!`);
        done();
      })
  })
  it('should reject create operation if key length greater than 32', (done) => {
    dataStore
      .create({
        key: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz',
        value: {
          a: 1,
          b: 2
        }
      })
      .then(() => done(new Error('Expected method to reject.')))
      .catch((error: Error) => {
        expect(error.message).to.equal(`Key length greater than 32 not allowed!`);
        done();
      })
  })
})

describe('DataStore Read Tests', () => {
  let dataStore: DataStore;

  before(() => {
    dataStore = new DataStore('read');
    return dataStore
      .create({
        key: 'temp_item',
        value: {
          a: 1,
          b: 2,
        },
        expiry: 1
      })
  })
  it('should return data if key exists', () => {
    return dataStore
      .read('temp_item')
      .then((data) => {
        expect(data).to.equal(JSON.stringify({ a: 1, b: 2 }));
      })
  })
  it('should return data before TTL expire', () => {
    setTimeout(() => {
      return dataStore
        .read('temp_item')
        .then((data) => {
          expect(data).to.equal(JSON.stringify({ a: 1, b: 2 }));
        })
    }, 500)
  })
  it('should reject read operation if key not found', (done) => {
    dataStore
    .read('item')
    .then(() => done(new Error('Expected method to reject.')))
    .catch((error: Error) => {
      expect(error.message).to.equal('Could not find any data for "item" to read!');
      done();
    })
  })
  it('should reject read operation if TTL expires', (done) => {
    setTimeout(() => {
      dataStore
        .read('temp_item')
        .then(() => done(new Error('Expected method to reject.')))
        .catch((error: Error) => {
          expect(error.message).to.equal(`Cannot read as data for "temp_item" has been expired!`);
          done();
        })
    }, 1500)
  })
})