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
        ink: {
          DEFAULT: '#11191b',
          soft: '#415054',
          dark: '#131a1b',
        },
        charcoal: '#11191b',
        darkBg: '#172022',
        muted: '#687476',
        supporting: '#687476',
        line: '#e5e9e9',
        teal: {
          DEFAULT: '#116b70',
          light: '#eaf4f3',
          hover: '#0e5559',
          dark: '#0c4447',
        },
        paper: '#ffffff',
        mist: '#f5f7f7',
        surface: '#f5f7f7',
        admin: {
          emerald: '#064E3B',
          forest: '#065F46',
          interactive: '#047857',
          hover: '#059669',
          accent: '#D1FAE5',
          softMint: '#ECFDF5',
          canvas: '#F5F9F7',
          sidebar: '#F2F8F5',
          surface: '#FFFFFF',
          text: '#102820',
          secondary: '#64748B',
          border: '#E2EBE7',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'Arial', 'sans-serif'],
        heading: ['var(--font-manrope)', 'var(--font-dm-sans)', 'sans-serif'],
      },
      maxWidth: {
        container: '1432px',
      },
      borderRadius: {
        custom: '20px',
      },
      boxShadow: {
        card: '0 20px 50px rgba(13,35,36,.09)',
        button: '0 5px 14px rgba(0,0,0,.07)',
      },
    },
  },
  plugins: [],
};

export default config;
