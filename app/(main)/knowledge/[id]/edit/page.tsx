'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, Space, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { knowledgeService } from '../../../../services/knowledge';
import type { KnowledgeBaseDTO, KnowledgeBaseVO } from '../../../../types/knowledge';
import { handleResponse } from '@/app/utils/request';

const { Title } = Typography;
const { TextArea } = Input;

export default function KnowledgeEditPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [knowledge, setKnowledge] = useState<KnowledgeBaseVO | null>(null);

  useEffect(() => {
    const fetchKnowledgeDetail = async () => {
      try {
        setLoading(true);
        const response = await knowledgeService.getById(Number(params.id));
        const data = handleResponse<KnowledgeBaseVO>(response.data, false);
        setKnowledge(data);
        form.setFieldsValue({
          name: data.name,
          description: data.description,
        });
      } catch (error) {
        console.error('获取知识库详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeDetail();
  }, [params.id, form]);

  const onFinish = async (values: KnowledgeBaseDTO) => {
    try {
      const response = await knowledgeService.update(Number(params.id), values);
      handleResponse(response.data);
      router.push(`/knowledge/${params.id}`);
    } catch (error) {
      console.error('更新知识库失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!knowledge) {
    return (
      <div className="text-center text-red-500">
        知识库不存在
      </div>
    );
  }

  return (
    <div>
      <Space className="mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          返回
        </Button>
      </Space>

      <Card>
        <Title level={2}>编辑知识库</Title>
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
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 