// <reference types="cypress" />
import fs = require('fs');

module.exports = (on) => {
  on('task', {
    readDir: async (path) => {
      return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
          if (err) {
            reject(err);
          } else {
            resolve(files);
          }
        });
      });
    },
  });
};
