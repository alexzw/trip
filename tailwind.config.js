/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f2f4f8',
        ink: '#101420',
        mist: '#67768b',
        sage: '#3dbb98',
        blossom: '#ffb49d',
        pine: '#0a84ff',
        sand: '#ffffff',
        slate: '#e7ebf3',
        sky: '#5ac8fa',
        gold: '#ff9f0a',
        rose: '#ff6b6b',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"PingFang TC"',
          '"PingFang HK"',
          '"Noto Sans TC"',
          'sans-serif',
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"PingFang TC"',
          '"Noto Sans TC"',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 12px 36px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'paper-glow':
          'linear-gradient(180deg, rgba(248,250,253,0.98), rgba(242,244,248,1) 48%, rgba(236,240,246,1))',
      },
    },
  },
  plugins: [],
}
