/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  singleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'all',
  semi: true,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
