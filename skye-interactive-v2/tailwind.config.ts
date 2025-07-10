import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // May or may not be present if primarily App Router
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'skye-primary-red': '#EF4444',
        'skye-primary-red-light': '#F87171',
        'skye-primary-blue': '#5A4FF2',
        'skye-primary-blue-light': '#818CF8',
        'skye-black': 'var(--color-skye-black)',
        'skye-gray': 'var(--color-skye-gray)',
        'skye-white': '#F5F5F5',
      },
      
      fontFamily: {
        'radio-grotesk': ['var(--font-radio-grotesk)', 'sans-serif'],
      },
      spacing: {
        
      }
    },
  },
  plugins: [],
}
export default config
  