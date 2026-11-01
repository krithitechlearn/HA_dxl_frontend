import { http, HttpResponse } from 'msw';

const BASE = import.meta?.env?.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const handlers = [
  http.get(`${BASE}/api/v1/devices`, () => {
    return HttpResponse.json({
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 20,
    });
  }),
];
