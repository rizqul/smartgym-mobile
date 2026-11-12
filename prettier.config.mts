import { type Config } from "prettier"

const config: Config = {
  semi: false,
  printWidth: 140,
  trailingComma: "none",
  singleAttributePerLine: true,
  plugins: ["prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.html",
      options: {
        singleAttributePerLine: false
      }
    }
  ]
}

export default config
