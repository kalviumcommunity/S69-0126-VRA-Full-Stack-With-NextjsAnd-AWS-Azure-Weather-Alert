import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",           // Standard src check
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",       // App router check
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",// Components check
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;