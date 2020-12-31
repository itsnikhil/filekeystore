// 
// Author: Nikhil Taneja (taneja.nikhil03@gmail.com)
// create.test.ts (c) 2020
// Desc: description
// Created:  Thu Dec 31 2020 20:01:53 GMT+0530 (India Standard Time)
// Modified: Thu Dec 31 2020 20:06:57 GMT+0530 (India Standard Time)
// 

import { DataStore } from '../src/index';
import { expect } from 'chai';
import { resolve as abspath } from 'path';

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