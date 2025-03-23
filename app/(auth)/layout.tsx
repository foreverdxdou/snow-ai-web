'use client';

import Logo from '../components/Logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #EBF4FF 0%, #E6E9FF 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* 背景网格 */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/grid.svg)',
          backgroundPosition: 'center',
          opacity: 0.3,
          maskImage: 'linear-gradient(to bottom, white, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, white, transparent)'
        }}
      />
      
      {/* 登录卡片 */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        margin: '0 16px',
        position: 'relative',
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '32px',
        }}>
          {/* Logo 和标题区域 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '32px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Logo />
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '8px',
            }}>AI 知识库系统</h1>
            <p style={{
              color: '#6b7280',
              margin: 0,
            }}>智能知识管理与问答平台</p>
          </div>
          
          {/* 表单内容 */}
          {children}
        </div>
      </div>
    </div>
  );
} 