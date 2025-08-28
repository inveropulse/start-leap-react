import { createTailwindConfig } from '@company/config/tailwind'

export default createTailwindConfig({
  content: [
    './src/**/*.{ts,tsx}',
    './index.html',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ]
})