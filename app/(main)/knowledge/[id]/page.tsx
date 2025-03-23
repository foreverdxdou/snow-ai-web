'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Typography, Button, Space, Spin, message, Modal } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { knowledgeService } from '@/app/services/knowledge';
import type { KnowledgeBaseVO, KnowledgeBasePermissionVO } from '@/app/types/knowledge';
import { handleResponse } from '@/app/utils/message';

const { Title } = Typography;

export default function KnowledgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [knowledge, setKnowledge] = useState<KnowledgeBaseVO | null>(null);

  useEffect(() => {
    const fetchKnowledgeDetail = async () => {
      try {
        setLoading(true);
        const response = await knowledgeService.getById(Number(params.id));
        const data = handleResponse<KnowledgeBaseVO>(response, false);
        setKnowledge(data);
      } catch (error) {
        console.error('获取知识库详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeDetail();
  }, [params.id]);

  const handleDelete = async () => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个知识库吗？',
      onOk: async () => {
        try {
          const response = await knowledgeService.delete(Number(params.id));
          handleResponse(response);
          router.push('/knowledge');
        } catch (error) {
          console.error('删除知识库失败:', error);
        }
      },
    });
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
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => router.push(`/knowledge/${params.id}/edit`)}
        >
          编辑
        </Button>
        <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
          删除
        </Button>
      </Space>

      <Card>
        <Title level={2}>{knowledge.name}</Title>
        <div className="mb-4">
          <Title level={4}>描述</Title>
          <p>{knowledge.description}</p>
        </div>

        <div className="mb-4">
          <Title level={4}>基本信息</Title>
          <p>创建者：{knowledge.creatorName}</p>
          <p>创建时间：{new Date(knowledge.createTime).toLocaleString()}</p>
          <p>更新时间：{new Date(knowledge.updateTime).toLocaleString()}</p>
          <p>状态：{knowledge.status === 1 ? '启用' : '禁用'}</p>
          <p>文档数量：{knowledge.documentCount}</p>
          <p>分类数量：{knowledge.categoryCount}</p>
          <p>标签数量：{knowledge.tagCount}</p>
        </div>

        <div>
          <Title level={4}>用户权限</Title>
          {knowledge.userPermissions?.map((permission: KnowledgeBasePermissionVO) => (
            <p key={permission.id}>
              {permission.userName} - {permission.permissionTypeName}
            </p>
          ))}
          {!knowledge.userPermissions?.length && (
            <p className="text-gray-500">暂无用户权限</p>
          )}
        </div>
      </Card>
    </div>
  );
} 