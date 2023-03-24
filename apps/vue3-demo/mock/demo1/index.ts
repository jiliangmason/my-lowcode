import type { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_utils';
import Data from './data.json';


export default [
  {
    url: '/xxx',
    timeout: 200,
    method: 'get',
    response: () => resultSuccess(Data),
  },
 
] as MockMethod[];
