import { createTailwindConfig } from '@company/config/tailwind'

export default createTailwindConfig({
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './apps/**/*.{ts,tsx}',
    './packages/**/*.{ts,tsx}',
  ]
})
