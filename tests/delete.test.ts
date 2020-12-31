// 
// Author: Nikhil Taneja (taneja.nikhil03@gmail.com)
// delete.test.ts (c) 2020
// Desc: description
// Created:  Thu Dec 31 2020 20:02:13 GMT+0530 (India Standard Time)
// Modified: Thu Dec 31 2020 20:07:18 GMT+0530 (India Standard Time)
// 

import { DataStore } from '../src/index';
import { expect } from 'chai';
import { after } from 'mocha';
import { unlink } from 'fs';

describe('DataStore Delete Tests', () => {

  let dataStore: DataStore;

  before(() => {
    dataStore = new DataStore('delete');
    return dataStore
      .create({
        key: 'item',
        value: {
          a: 1,
          b: 2,
        }
      })
  })
  after(() => {
    unlink('./create.json', () => { });
    unlink('./read.json', () => { });
    unlink('./delete.json', () => { });
  })

  it('should reject delete operation if key not found', (done) => {
    dataStore
      .delete('not_item')
      .then(() => done(new Error('Expected method to reject.')))
      .catch((error: Error) => {
        expect(error.message).to.equal('Could not find any data for "not_item" to delete!');
        done();
      })
  })
  it('should delete data if key exists', () => {
    return dataStore
      .delete('item')
      .then((data) => {
        expect(data).to.equal('Deleted!');
      })
  })
})