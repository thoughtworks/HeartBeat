// <reference types="cypress" />
import fs = require('fs');

module.exports = (on) => {
  on('task', {
    clearDownloads: () => {
      const downloadsFolder = 'cypress/downloads';
      clearDownloadsFolder(downloadsFolder);
      return null;
    },
  });
};

function clearDownloadsFolder(folder) {
  try {
    fs.readdirSync(folder).forEach((file) => {
      const filePath = `${folder}/${file}`;
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${filePath}`);
    });
  } catch (error) {
    console.error('Error clearing downloads folder:', error);
  }
}
