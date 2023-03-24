import Axios from 'axios';
import router from '@/router';
import type { AxiosInstanceTypingWithUrl } from './axiosInstanceTypingWithUrl';
import {
  RESULT_OK,
  NET_WORK_ERROR_DEFAULT_MSG,
  SERVER_ERROR_STATUS,
  RESULT_LOGIN,
} from '@/constants/global';

export interface IBase<T> {
  data: T;
  result: number;
  msg?: string;
  traceId?: string;
}

const axios: AxiosInstanceTypingWithUrl = Axios.create({
  baseURL: '/',
});

axios.interceptors.response.use(
  (res) => {
    const { data } = res;
    const result = +data.result;
    if (data) {
      if (result !== RESULT_OK) {
        if (result === RESULT_LOGIN) {
          const redirectUrl = window.location.href;
          router.replace(`/login?redirectUrl=${encodeURIComponent(redirectUrl)}`);
          return;
        }
        /** 兼容后端抛出异常, 但不返回异常原因的情况 */
        data.msg || (data.msg = NET_WORK_ERROR_DEFAULT_MSG);
      }
      if (data.status !== SERVER_ERROR_STATUS) {
        return data;
      }
    }

    return Promise.reject(data);
  },
  (err) => {
    if (err instanceof Axios.Cancel) {
      return {};
    }
    Promise.reject(err);
  },
);
export default axios;
