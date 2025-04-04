# Snow AI - Intelligent Knowledge Management System

```
   _____ _   _  ______          __
  / ____| \ | |/ __ \ \        / /
 | (___ |  \| | |  | \ \  /\  / / 
  \___ \| . ` | |  | |\ \/  \/ /  
  ____) | |\  | |__| | \  /\  /   
 |_____/|_| \_|\____/   \/  \/    
                    * intelligent *
```

A modern intelligent knowledge management system built with Next.js and Material-UI, providing knowledge base management, document parsing, and AI-powered Q&A capabilities.

Author: [@foreverdxdou](https://github.com/foreverdxdou)

[中文文档](README_CN.md)

## ✨ Features

- 🎯 Knowledge Base Management: Create and manage multiple knowledge bases with category and tag support
- 📄 Document Processing: Support for uploading, parsing, and managing multiple document formats
- 🤖 AI Q&A: Intelligent Q&A system based on large language models
- 🌐 Internationalization: Support for English and Chinese
- 🎨 Theme Switching: Light/Dark theme support
- 🔐 Access Control: Complete user, role, and permission management system
- 💫 Elegant Animations: Carefully designed transitions and interactions
- 📱 Responsive: Perfect support for desktop and mobile devices

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **UI Library**: [Material-UI (MUI)](https://mui.com/)
- **State Management**: React Hooks
- **Styling Solution**: Emotion + MUI System
- **Internationalization**: i18next
- **Type Checking**: TypeScript
- **Code Quality**: ESLint + Prettier
- **HTTP Client**: Axios

## 🚀 Getting Started

1. Clone the repository

```bash
git clone https://github.com/foreverdxdou/snow-ai-web.git
cd snow-ai-web
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:8000](http://localhost:8000) to view the application.

## 📦 Project Structure

```
snow-ai/
├── app/                    # Next.js application directory
│   ├── (main)/            # Main layout routes
│   ├── components/        # Shared components
│   ├── hooks/            # Custom React hooks
│   ├── i18n/             # Internationalization config and translations
│   ├── services/         # API services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── public/               # Static assets
└── package.json         # Project configuration
```

## 🔧 Configuration

1. Environment variables (create `.env.development` file):

```env
NEXT_PUBLIC_API_URL=your_api_url
```

2. Internationalization configuration is located in `app/i18n/` directory

3. Theme configuration is located in `app/theme/` directory

## 📚 Core Modules

- 📊 Dashboard
  - Statistics Overview
  - Latest Updates
  - Trend Charts

- 💡 Knowledge Base
  - Knowledge Base Creation & Management
  - Document Upload & Parsing
  - Categories & Tags Management

- 🤖 AI Assistant
  - Knowledge-based Q&A
  - Multiple Model Support
  - Conversation History

- ⚙️ System Management
  - User Management
  - Role Management
  - Permission Management
  - System Configuration

## 🤝 Contributing

Contributions are welcome! Before submitting a Pull Request, please ensure:

1. Your code passes ESLint checks
2. New features include appropriate tests
3. Documentation is updated

## 📄 License

This project is licensed under a modified MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Thanks to all the developers who have contributed to this project.

---

Made with ❤️ by [@foreverdxdou](https://github.com/foreverdxdou)
