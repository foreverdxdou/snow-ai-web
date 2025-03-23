import { AxiosResponse } from 'axios';

export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

export function handleResponse<T>(
  response: Result<T> | AxiosResponse<Result<T>>,
  onSuccess: (data: T) => void
): void {
  const result = 'data' in response ? response.data : response;
  if (result.code === 200) {
    onSuccess(result.data);
  } else {
    throw new Error(result.message || '操作失败');
  }
} 