## Coverage
| US ID | Routes/Pages | Components/Hooks | API IDs | Tests |
|-------|--------------|------------------|---------|-------|
| US-001 | /login | LoginPage, LoginForm, useAuth | API-001, API-002 | LoginForm.test.tsx, useAuth.test.tsx |

## Deviations and Gaps
- None identified.

## Assumptions Applied
- A-02: Authentication uses stateless JWT stored in HttpOnly cookies.
- A-10: All timestamps are stored in UTC; frontend converts to local timezone for display.

## Configuration Keys
- VITE_API_BASE_URL: Backend API base URL.

## Dependencies Added Beyond the Fixed Stack
- Zustand: Used for lightweight global state management for authentication.

## How to Build, Test and Run
```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run type-check
npm run test
```
Environment variables:
- VITE_API_BASE_URL: Set to the backend API base URL.

## Not Generated
- E2E tests (deferred to future sprint).
- Backend code.
