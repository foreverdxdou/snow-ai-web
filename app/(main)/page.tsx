'use client';

import { Card, Row, Col, Statistic } from 'antd';
import { BookOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { memo } from 'react';

// 使用 memo 包装统计卡片组件
const StatisticCard = memo(({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <Col xs={24} sm={8}>
    <Card>
      <Statistic
        title={title}
        value={value}
        prefix={icon}
      />
    </Card>
  </Col>
));

StatisticCard.displayName = 'StatisticCard';

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">欢迎使用 AI 知识库系统</h1>
      
      <Row gutter={[16, 16]}>
        <StatisticCard
          title="知识库数量"
          value={3}
          icon={<BookOutlined />}
        />
        <StatisticCard
          title="用户数量"
          value={100}
          icon={<UserOutlined />}
        />
        <StatisticCard
          title="文档数量"
          value={50}
          icon={<FileTextOutlined />}
        />
      </Row>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold mb-4">快速开始</h2>
        <p className="text-gray-600">
          欢迎使用 AI 知识库系统。您可以通过左侧菜单访问不同的功能模块。
          在知识库中，您可以浏览和管理您的知识内容。
          在设置中，您可以管理您的个人信息和系统偏好。
        </p>
      </Card>
    </div>
  );
} 