import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 获取根 DOM 元素
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 创建 React 根实例并渲染应用
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);