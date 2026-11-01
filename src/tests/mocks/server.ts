import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW server for API mocking in tests
 */
export const server = setupServer(...handlers);