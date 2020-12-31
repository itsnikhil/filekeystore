// 
// Author: Nikhil Taneja (taneja.nikhil03@gmail.com)
// read.test.ts (c) 2020
// Desc: description
// Created:  Thu Dec 31 2020 20:02:05 GMT+0530 (India Standard Time)
// Modified: Thu Dec 31 2020 20:12:07 GMT+0530 (India Standard Time)
// 

import { DataStore } from '../src/index';
import { expect } from 'chai';
import { after } from 'mocha';
import { unlink } from 'fs';

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
  after(() => {
    unlink('./create.json', () => { });
    unlink('./read.json', () => { });
    unlink('./delete.json', () => { });
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