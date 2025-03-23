import { message } from 'antd';
import type { Result } from '../types/knowledge';

export const handleResponse = <T>(response: Result<T>, showMessage: boolean = true): T => {
  if (response.code === 200) {
    if (showMessage) {
      message.success(response.message || '操作成功');
    }
    return response.data;
  } else {
    if (showMessage) {
      message.error(response.message || '操作失败');
    }
    throw new Error(response.message);
  }
}; 