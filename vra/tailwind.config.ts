import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'flood-low': '#10b981',
        'flood-medium': '#eab308',
        'flood-high': '#f97316',
        'flood-severe': '#dc2626',
      },
    },
  },
  plugins: [],
};

export default config;
