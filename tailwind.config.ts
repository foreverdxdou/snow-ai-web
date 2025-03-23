import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C8EF2',
        secondary: '#76E3C4',
      },
      transitionDuration: {
        '300': '300ms',
      },
      minHeight: {
        '2.5rem': '2.5rem',
      },
      maxWidth: {
        '200px': '200px',
      },
      visibility: {
        'hover': 'visible',
        'group-hover': 'visible',
      },
      opacity: {
        'hover': '1',
        'group-hover': '1',
      },
      display: {
        'hover': 'block',
        'group-hover': 'block',
      },
    },
  },
  corePlugins: {
    preflight: false, // 禁用 Tailwind 的基础样式，避免与 Ant Design 冲突
  },
  plugins: [],
  important: true, // 添加这行以确保 Tailwind 样式优先级
};

export default config; 