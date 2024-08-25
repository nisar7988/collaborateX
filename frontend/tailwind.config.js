// tailwind.config.js
const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      screens: {
        'custom-md': '1087px', // Add custom breakpoint
      },
    },
  },
  content: [
    "./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  plugins: [require('flowbite/plugin'),
    flowbite.plugin(),
  ],
};
