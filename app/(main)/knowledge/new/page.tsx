'use client';

import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { knowledgeService } from '../../../services/knowledge';
import type { KnowledgeBaseDTO } from '../../../types/knowledge';

const { Title } = Typography;
const { TextArea } = Input;

export default function KnowledgeNewPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: KnowledgeBaseDTO) => {
    try {
      await knowledgeService.create(values);
      message.success('创建成功');
      router.push('/knowledge');
    } catch (error) {
      console.error('创建知识库失败:', error);
    }
  };

  return (
    <div>
      <Space className="mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          返回
        </Button>
      </Space>

      <Card>
        <Title level={2}>新建知识库</Title>
        <Form
          form={form}
          name="knowledge"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入知识库名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入知识库描述' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              创建
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 