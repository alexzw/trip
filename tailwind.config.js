/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F8F7F4',
        ink: '#111827',
        mist: '#6B7280',
        sage: '#2F5D50',
        blossom: '#E8AFA6',
        pine: '#2F5D50',
        sand: '#FFFFFF',
        slate: '#E5E7EB',
        sky: '#8EC5B7',
        gold: '#B78628',
        rose: '#D17D6F',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang TC"',
          'sans-serif',
        ],
        display: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang TC"',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 8px 24px rgba(17, 24, 39, 0.05)',
      },
      backgroundImage: {
        'paper-glow':
          'linear-gradient(180deg, rgba(252,251,248,1), rgba(248,247,244,1) 52%, rgba(244,242,237,1))',
      },
    },
  },
  plugins: [],
}
