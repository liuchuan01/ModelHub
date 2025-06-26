import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  /* 极简线条风格配色 - 类似X/v0 */
  :root {
    --color-white: #ffffff;
    --color-black: #0f0f0f;
    --color-gray-50: #fafafa;
    --color-gray-100: #f5f5f5;
    --color-gray-200: #e5e5e5;
    --color-gray-300: #d4d4d4;
    --color-gray-400: #a3a3a3;
    --color-gray-500: #737373;
    --color-gray-600: #525252;
    --color-gray-700: #404040;
    --color-gray-800: #262626;
    --color-gray-900: #171717;
    
    /* 主色调 - 使用灰色替代蓝色 */
    --color-primary: var(--color-gray-800);
    --color-primary-hover: var(--color-gray-900);
    --color-accent: var(--color-gray-100);
    --color-accent-hover: var(--color-gray-200);
    
    /* 功能色彩 - 更克制的色彩 */
    --color-green-500: #22c55e;
    --color-orange-500: #f59e0b;
    --color-red-500: #ef4444;
    
    /* 字体 */
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
                 'Helvetica Neue', sans-serif;
    
    /* 阴影 - 更微妙的阴影 */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.03);
    --shadow-md: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.03);
    --shadow-lg: 0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.04);
    
    /* 边框 - 线条风格 */
    --border-width: 1px;
    --border-color: var(--color-gray-200);
    --border-hover: var(--color-gray-300);
    
    /* 边框半径 - 更小的圆角 */
    --radius-sm: 0.125rem;
    --radius-md: 0.25rem;
    --radius-lg: 0.5rem;
    
    /* 动画 */
    --transition-fast: 0.15s ease-out;
    --transition-normal: 0.3s ease-out;
    --transition-slow: 0.5s ease-out;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-sans);
    background-color: var(--color-white);
    color: var(--color-gray-900);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    font-family: inherit;
    border: none;
    background: none;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  input, textarea {
    font-family: inherit;
    border: none;
    outline: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* 自定义滚动条 */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-gray-100);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-gray-300);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-gray-400);
  }

  /* 选中文本样式 */
  ::selection {
    background: var(--color-gray-200);
    color: var(--color-gray-900);
  }
` 