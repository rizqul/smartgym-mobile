// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config")
const expoConfig = require("eslint-config-expo/flat")

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "import/no-named-as-default-member": "off"
    }
  }
])
