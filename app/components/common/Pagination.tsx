import { Pagination as AntPagination } from 'antd';

interface CommonPaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  className?: string;
  pageSizeOptions?: string[];
}

export const Pagination: React.FC<CommonPaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
  className = '',
  pageSizeOptions = ['10', '20', '50', '100'],
}) => {
  return (
    <AntPagination style={{display: 'flex', justifyContent: 'flex-end'}}
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={onChange}
      showSizeChanger
      showQuickJumper
      showTotal={(total) => `共 ${total} 条`}
      pageSizeOptions={pageSizeOptions}
    />
  );
}; 