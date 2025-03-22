import React from 'react';
import { Select, Space } from 'antd';
import * as Icons from '@ant-design/icons';

const iconList = Object.keys(Icons)
  .filter(key => key.endsWith('Outlined'))
  .map(key => ({
    label: key,
    value: key,
    icon: React.createElement(Icons[key as keyof typeof Icons])
  }));

interface IconSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const IconSelect: React.FC<IconSelectProps> = ({ value, onChange }) => {
  return (
    <Select
      showSearch
      value={value}
      onChange={onChange}
      options={iconList}
      optionLabelProp="value"
      optionRender={option => (
        <Space>
          {option.data.icon}
          {option.data.label}
        </Space>
      )}
    />
  );
}; 