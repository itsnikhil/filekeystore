// 
// Author: Nikhil Taneja (taneja.nikhil03@gmail.com)
// index.ts (c) 2020
// Desc: description
// Created:  Wed Dec 30 2020 21:50:22 GMT+0530 (India Standard Time)
// Modified: Thu Dec 31 2020 14:40:02 GMT+0530 (India Standard Time)
// 

const fs = require('fs');
const jsonfile = require('jsonfile');
const { parser } = require('stream-json');
const { chain } = require('stream-chain');
const { pick } = require('stream-json/filters/Pick');
const { streamObject } = require('stream-json/streamers/StreamObject');

interface KeyValuePair {
  key: string;
  value: Object;
  expiry?: number;
}

type JSONObject = {
  [key: string]: Object;
}


export class DataStore {
  private S: number;
  private mutex: number;
  private concurrent_reads: number;
  
  constructor(private file: string, private path: string = '.') {
    this.file = file;
    this.path = path;
    this.S = 1; // write lock
    this.mutex = 1; // Read resource 
    this.concurrent_reads = 0;
  }
  
  // Semaphore lock
  private wait = (): void => {
    while (this.S <= 0);
    this.S--;
  }
  // Semaphore release
  private signal = (): void => {
    this.S++;
  }

  create = (data: KeyValuePair): void => {
    this.wait();
    
    const filepath: string = `${this.path}/${this.file}.json`;
    if (Object.keys(data.value).length == 0) {
      console.error('Data cannot be empty!');
      return;
    }
    if (data.expiry) data.expiry = (data.expiry * 1000) + Date.now();
    
    if (fs.existsSync(filepath)) {
      jsonfile.readFile(filepath)
        .then(existing_data => {
          if (existing_data.hasOwnProperty(data.key)) {
            console.log(`"${data.key}" already exists!`);
            this.signal();
          }
          else {
            existing_data[data.key] = {
              value: data.value,
              expiry: data.expiry
            }
            jsonfile.writeFile(filepath, existing_data)
              .then(() => {
                console.log('Write complete!')
                this.signal();
              })
              .catch(error => console.error(error))
          }
        })
        .catch(error => console.error(error))
    }
    else {
      let obj: JSONObject = {
        [data.key]: {
          value: data.value,
          expiry: data.expiry
        }
      }
      jsonfile.writeFile(filepath, obj)
        .then(() => {
          console.log('Write complete!')
          this.signal();
        })
        .catch(error => console.error(error));
    }
  }

  read = (key: string): void => {
    // wait(this.mutex);
    console.log('READ INIT', this.S);
    this.concurrent_reads++;
    if (this.concurrent_reads == 1)
      this.wait();
    // signal(this.mutex);
    const filepath: string = `${this.path}/${this.file}.json`;
    const pipeline = chain([
      fs.createReadStream(filepath),
      parser(),
      pick({ filter: key }),
      streamObject()
    ]);
    let data: KeyValuePair = {
      key: key,
      value: {},
      expiry: undefined
    };
    pipeline.on('data', obj => data[obj.key] = obj.value);
    pipeline.on('end', () => {
      if (Object.keys(data.value).length) {
        if (data.expiry && data.expiry < Date.now())
          console.log(`Data for ${data.key} has been expired!`);
        else
          console.log(`For key "${key}" value is =>`, data.value);
      }
      else
        console.warn(`Could not find any data for "${key}"!`);
      // wait(this.mutex);
      this.concurrent_reads--;
      if (this.concurrent_reads == 0)
       this.signal();
      // signal(this.mutex);
    });
  }

  delete = (key: string): void => {
    this.wait();
    
    const filepath: string = `${this.path}/${this.file}.json`;
    jsonfile.readFile(filepath)
      .then(obj => {
        if (obj.hasOwnProperty(key)) {
          delete obj[key];
          jsonfile.writeFile(filepath, obj)
          .then(() => {
              console.log('Deleted!');
              this.signal();
            })
            .catch(error => console.error(error));
        }
        else {
          console.warn(`Could not find any data for "${key}"!`)
          this.signal();
        }
      })
      .catch(error => console.error(error))
  }
}