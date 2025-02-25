const path = require("node:path");

/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {
      config: path.resolve(__dirname, "tailwind.config.cjs"),
    },
  },
};
