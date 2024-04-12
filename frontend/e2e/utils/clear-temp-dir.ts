import { CONFIG_STEP_SAVING_FILENAME } from 'e2e/fixtures';
import path from 'path';
import fs from 'fs';

const clearTempDir = async () => {
  try {
    const configStepSavePath = path.resolve(__dirname, '..', './temp/', `./${CONFIG_STEP_SAVING_FILENAME}`);
    const isExist = fs.existsSync(configStepSavePath);
    if (isExist) {
      fs.rmSync(configStepSavePath);
    }
  } finally {
    console.log('e2e/temp/ dir cleared, going to start testing suite.');
  }
};

export { clearTempDir };
