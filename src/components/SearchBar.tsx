import React, { useState, useEffect } from 'react';
import { AutoComplete, Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import * as api from '@/api/search';

const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const handleSearch = debounce(async (keyword: string) => {
    if (!keyword) {
      setOptions([]);
      return;
    }
    try {
      setLoading(true);
      const suggestions = await api.suggest(keyword);
      setOptions(suggestions.map(item => ({ value: item, label: item })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSelect = (value: string) => {
    navigate(`/search?keyword=${encodeURIComponent(value)}`);
  };

  const handlePressEnter = () => {
    if (value) {
      navigate(`/search?keyword=${encodeURIComponent(value)}`);
    }
  };

  return (
    <AutoComplete
      value={value}
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      onChange={setValue}
      style={{ width: 300 }}
    >
      <Input
        size="large"
        placeholder={t('search.placeholder')}
        prefix={loading ? <Spin size="small" /> : <SearchOutlined />}
        onPressEnter={handlePressEnter}
      />
    </AutoComplete>
  );
};

export default SearchBar; 