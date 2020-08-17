module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  rules: {
    semi: ["error", "never"],
    quotes: ["error", "single"],
    camelcase: "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/consistent-type-assertions": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/camelcase": "off",
  },
};
