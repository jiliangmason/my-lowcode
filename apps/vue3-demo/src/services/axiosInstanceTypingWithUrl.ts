import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

type IAllUrls = string;
export interface AxiosInstanceTypingWithUrl extends AxiosInstance {
  get<T = any, R = AxiosResponse<T>>(url: IAllUrls, config?: AxiosRequestConfig): Promise<R>;
  delete<T = any, R = AxiosResponse<T>>(url: IAllUrls, config?: AxiosRequestConfig): Promise<R>;
  head<T = any, R = AxiosResponse<T>>(url: IAllUrls, config?: AxiosRequestConfig): Promise<R>;
  options<T = any, R = AxiosResponse<T>>(url: IAllUrls, config?: AxiosRequestConfig): Promise<R>;
  post<T = any, R = AxiosResponse<T>>(
    url: IAllUrls,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  put<T = any, R = AxiosResponse<T>>(
    url: IAllUrls,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  patch<T = any, R = AxiosResponse<T>>(
    url: IAllUrls,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>;
}
