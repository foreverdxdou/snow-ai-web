import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { Providers } from "./providers";
import { App as AntdApp } from 'antd';
import 'antd/dist/reset.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI知识库",
  description: "AI知识库系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Providers>
          <ThemeProvider>
            <AntdApp>
              {children}
            </AntdApp>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
