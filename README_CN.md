# Snow AI - 智能知识管理系统

```
   _____ _   _  ______          __
  / ____| \ | |/ __ \ \        / /
 | (___ |  \| | |  | \ \  /\  / / 
  \___ \| . ` | |  | |\ \/  \/ /  
  ____) | |\  | |__| | \  /\  /   
 |_____/|_| \_|\____/   \/  \/    
                    * intelligent *
```

一个基于 Next.js 和 Material-UI 构建的现代化智能知识管理系统，提供知识库管理、文档解析、智能问答等功能。

作者: [@foreverdxdou](https://github.com/foreverdxdou)

[English](README.md)

## ✨ 特性

- 🎯 知识库管理：创建和管理多个知识库，支持文档分类和标签管理
- 📄 文档处理：支持多种格式文档的上传、解析和管理
- 🤖 智能问答：基于大语言模型的智能问答系统
- 🌐 国际化：支持中英文切换
- 🎨 主题切换：支持亮色/暗色主题
- 🔐 权限管理：完整的用户、角色、权限管理体系
- 💫 优雅动效：精心设计的过渡动画和交互效果
- 📱 响应式：完美支持桌面端和移动端

## 🛠 技术栈

- **框架**: [Next.js 14](https://nextjs.org/)
- **UI**: [Material-UI (MUI)](https://mui.com/)
- **状态管理**: React Hooks
- **样式方案**: Emotion + MUI System
- **国际化**: i18next
- **类型检查**: TypeScript
- **代码规范**: ESLint + Prettier
- **HTTP 客户端**: Axios

## 🚀 快速开始

1. 克隆项目

```bash
git clone https://github.com/foreverdxdou/snow-ai.git
cd snow-ai
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📦 项目结构

```
snow-ai/
├── app/                    # Next.js 应用目录
│   ├── (main)/            # 主布局路由
│   ├── components/        # 公共组件
│   ├── hooks/            # 自定义 Hooks
│   ├── i18n/             # 国际化配置和翻译文件
│   ├── services/         # API 服务
│   ├── types/            # TypeScript 类型定义
│   └── utils/            # 工具函数
├── public/               # 静态资源
└── package.json         # 项目配置
```

## 🔧 配置说明

1. 环境变量配置（创建 `.env.local` 文件）：

```env
NEXT_PUBLIC_API_URL=你的API地址
```

2. 国际化配置位于 `app/i18n/` 目录

3. 主题配置位于 `app/theme/` 目录

## 📚 主要功能模块

- 📊 仪表盘
  - 数据统计
  - 最新动态
  - 趋势图表

- 💡 知识库管理
  - 知识库创建与管理
  - 文档上传与解析
  - 分类与标签管理

- 🤖 智能问答
  - 基于知识库的智能问答
  - 多模型支持
  - 对话历史管理

- ⚙️ 系统管理
  - 用户管理
  - 角色管理
  - 权限管理
  - 系统配置

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request。在提交 PR 之前，请确保：

1. 代码通过 ESLint 检查
2. 新功能包含适当的测试
3. 更新相关文档

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者。

---

Made with ❤️ by [@foreverdxdou](https://github.com/foreverdxdou) 