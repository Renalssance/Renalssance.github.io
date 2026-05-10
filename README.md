# Zhu Jielin Personal Homepage

这是一个基于 Vite、React、TypeScript 和 Tailwind CSS 构建的个人主页项目，用于展示朱皆霖的教育背景、研究方向、项目经历、论文成果与联系方式。页面采用单页滚动结构，包含动态粒子背景、响应式导航、头像 Hero 区、GitHub 数据统计、技术雷达图、教育与科研时间线、精选项目卡片、论文板块和联系入口。

主页内容结合公开项目与论文链接整理，重点呈现以下方向：

- 信息与通信工程、无线通信、深度学习和智能网络背景
- 多 Agent 智能旅行规划助手（内容参考项目仓库：https://github.com/Renalssance/LangGraph-trip-planner）
- 遥感灾害多模态大模型训练与推理系统
- 面向任务导向通信和卫星边缘推理的鲁棒信息瓶颈研究
- Fisher-Robust Information Bottleneck for Task-Oriented Communication with Noisy Data（内容参考 IEEE Xplore：https://ieeexplore.ieee.org/abstract/document/10827769）

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- lucide-react
- Recharts

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建产物会输出到 `dist/`，项目已在 `vite.config.ts` 中配置相对路径，便于部署到 GitHub Pages。

> This web page was initially generated with Gemini 3 Pro and then refined with resume-based content.
