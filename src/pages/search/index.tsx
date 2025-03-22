import React, { useEffect, useState } from 'react';
import { Card, List, Tag, Space, Empty } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as api from '@/api/search';
import type { SearchResult } from '@/types/search';

const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);

  const keyword = searchParams.get('keyword') || '';
  const kbId = searchParams.get('kbId');
  const categoryId = searchParams.get('categoryId');
  const tagIds = searchParams.getAll('tagIds');

  useEffect(() => {
    if (keyword) {
      fetchResults();
    }
  }, [keyword, kbId, categoryId, tagIds, current]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await api.search({
        keyword,
        kbId: kbId ? Number(kbId) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        tagIds: tagIds.map(Number),
        current,
        size: 10
      });
      setResults(data.records);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrent(page);
  };

  return (
    <Card title={t('search.result', { keyword })}>
      <List
        loading={loading}
        dataSource={results}
        pagination={{
          current,
          pageSize: 10,
          total,
          onChange: handlePageChange
        }}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={
                <Space>
                  <a href={`/document/${item.id}`}>{item.title}</a>
                  <Tag color="blue">{item.kbName}</Tag>
                  <Tag>{item.categoryName}</Tag>
                </Space>
              }
              description={
                <div>
                  <div className="text-gray-500 mb-2">{item.summary}</div>
                  <div className="text-gray-400 text-sm">
                    {t('search.score')}: {item.score.toFixed(2)}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
        locale={{
          emptyText: <Empty description={t('search.empty')} />
        }}
      />
    </Card>
  );
};

export default SearchPage; 