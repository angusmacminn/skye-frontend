import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/MobileNav.tsx',
    './src/components/Header.tsx',
    './src/app/layout.tsx',
  ],
  theme: {
    extend: {
      colors: {
        'skye-primary-red': '#EF4444',
        'skye-primary-red-light': '#F87171',
        'skye-primary-blue': '#5A4FF2',
        'skye-primary-blue-light': '#818CF8',
        'skye-black': '#1C1414', 
        'skye-gray': '#424141',
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
  