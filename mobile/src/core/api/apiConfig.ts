import type { CreateAxiosDefaults } from 'axios';

import { API_URL } from '../config';

export const apiConfig: CreateAxiosDefaults = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
