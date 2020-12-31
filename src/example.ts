// 
// Author: Nikhil Taneja (taneja.nikhil03@gmail.com)
// example.ts (c) 2020
// Desc: description
// Created:  Thu Dec 31 2020 00:12:25 GMT+0530 (India Standard Time)
// Modified: Thu Dec 31 2020 14:36:26 GMT+0530 (India Standard Time)
// 

import { DataStore } from './index';

let dataStore = new DataStore('data');
dataStore.create({
    key: 'item',
    value: {
        a: 1,
        b: 2
    },
    expiry: 3
})
dataStore.read('item')
setTimeout(() => dataStore.read('item'), 1000)
setTimeout(() => dataStore.read('item'), 2000)
setTimeout(() => dataStore.read('item'), 2900)
setTimeout(() => dataStore.read('item'), 3000)
setTimeout(() => dataStore.read('item'), 4000)
setTimeout(() => dataStore.read('item'), 5000)
dataStore.delete('item')