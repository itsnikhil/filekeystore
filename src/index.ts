//
// Author: Nikhil Taneja (taneja.nikhil03@gmail.com)
// index.ts (c) 2020
// Desc: description
// Created:  Wed Dec 30 2020 21:50:22 GMT+0530 (India Standard Time)
// Modified: Thu Dec 31 2020 19:53:09 GMT+0530 (India Standard Time)
//

import * as fs from 'fs';
import * as jsonfile from 'jsonfile';
import { resolve as abspath } from 'path';
import { parser } from 'stream-json';
import { chain } from 'stream-chain';
import { pick } from 'stream-json/filters/Pick';
import { streamObject } from 'stream-json/streamers/StreamObject';

interface KeyValuePair {
  key: string;
  value: object;
  expiry?: number;
}

type JSONObject = {
  [key: string]: object;
};

export class DataStore {
  constructor(private file: string, private path: string = '.') {
    this.file = file;
    this.path = path;
  }

  filepath: string = abspath(`${this.path}\\${this.file}.json`);

  create = (data: KeyValuePair): Promise<string> => {
    const filepath: string = `${this.path}\\${this.file}.json`;
    return new Promise((resolve, reject) => {
      if (Object.keys(data.value).length === 0) {
        reject(new Error('Data cannot be empty!'));
      }
      if (data.key.length > 32) {
        reject(new Error('Key length greater than 32 not allowed!'));
      }
      if (data.expiry) data.expiry = data.expiry * 1000 + Date.now();

      if (fs.existsSync(filepath)) {
        jsonfile
          .readFile(filepath)
          .then((existingData: JSONObject) => {
            if (existingData.hasOwnProperty(data.key)) {
              reject(new Error(`Could not create as data for "${data.key}" already exists!`));
            } else {
              existingData[data.key] = {
                value: data.value,
                expiry: data.expiry,
              };
              jsonfile
                .writeFile(filepath, existingData)
                .then(() => {
                  resolve(`Write complete! Saved to "${abspath(filepath)}"`);
                })
                .catch((error: Error) => reject(error));
            }
          })
          .catch((error: Error) => reject(error));
      } else {
        const obj: JSONObject = {
          [data.key]: {
            value: data.value,
            expiry: data.expiry,
          },
        };
        jsonfile
          .writeFile(filepath, obj)
          .then(() => {
            resolve(`Write complete! Saved to "${abspath(filepath)}"`);
          })
          .catch((error: Error) => reject(error));
      }
    });
  };

  read = (key: string): Promise<string> => {
    const filepath: string = `${this.path}\\${this.file}.json`;
    return new Promise((resolve, reject) => {
      const pipeline = chain([fs.createReadStream(filepath), parser(), pick({ filter: key }), streamObject()]);
      const data: KeyValuePair = {
        key,
        value: {},
        expiry: undefined,
      };
      pipeline.on('data', (obj: JSONObject) => {
        if (obj.key.toString() === 'value') data.value = obj.value;
        else if (obj.key.toString() === 'expiry') data.expiry = +obj.value;
      });
      pipeline.on('end', () => {
        if (Object.keys(data.value).length) {
          if (data.expiry && data.expiry < Date.now())
            reject(new Error(`Cannot read as data for "${data.key}" has been expired!`));
          else resolve(JSON.stringify(data.value));
        } else reject(new Error(`Could not find any data for "${key}" to read!`));
      });
      pipeline.on('error', (err: Error) => reject(err));
    });
  };

  delete = (key: string): Promise<string> => {
    const filepath: string = `${this.path}\\${this.file}.json`;
    return new Promise((resolve, reject) => {
      jsonfile
        .readFile(filepath)
        .then((obj: JSONObject) => {
          if (obj.hasOwnProperty(key)) {
            delete obj[key];
            jsonfile
              .writeFile(filepath, obj)
              .then(() => {
                resolve('Deleted!');
              })
              .catch((error: Error) => reject(error));
          } else {
            reject(new Error(`Could not find any data for "${key}" to delete!`));
          }
        })
        .catch((error: Error) => reject(error));
    });
  };
}
