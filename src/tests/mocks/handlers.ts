import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * MSW request handlers for API mocking
 */
export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { username: string; password: string };
    
    if (body.username === 'admin' && body.password === 'Admin@123') {
      return HttpResponse.json({
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          username: 'admin',
          email: 'admin@ha-dxl.com',
          role: 'ADMIN',
          isActive: true,
        },
      }, { status: 200 });
    }
    
    return HttpResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: 401,
        errorCode: 'AUTHENTICATION_FAILED',
        message: 'Invalid credentials',
        path: '/api/v1/auth/login',
        traceId: 'test-trace-id',
        fieldErrors: [],
      },
      { status: 401 }
    );
  }),

  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Device endpoints
  http.get(`${API_BASE_URL}/devices`, () => {
    return HttpResponse.json({
      content: [
        {
          id: 'device-1',
          name: 'Living Room Light',
          deviceType: 'LIGHT',
          status: 'ONLINE',
          manufacturer: 'Philips',
          modelNumber: 'HUE-001',
          roomId: 'room-1',
          roomName: 'Living Room',
          version: 0,
          isActive: true,
          attributes: {},
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 20,
    });
  }),

  // Fallback handler
  http.all('*', () => {
    return new HttpResponse(null, { status: 404 });
  }),
];