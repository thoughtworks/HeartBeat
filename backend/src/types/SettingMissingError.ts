export class SettingMissingError extends Error {
  constructor(settingType: string) {
    super(`missing ${settingType}.`);
  }
}
