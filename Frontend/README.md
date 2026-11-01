# HA DXL Frontend

React 18 + TypeScript SPA for the Home Automation Device Experience Layer (DXL) platform.

## Tech Stack

- **React 18** + TypeScript (strict mode)
- **Vite** (build tool)
- **React Router v6** (routing)
- **Axios** (HTTP client with interceptors)
- **React Hook Form** + **Zod** (forms and validation)
- **Zustand** (auth state management)
- **Recharts** (telemetry visualization)
- **Jest** + **React Testing Library** + **jest-axe** (testing)
- **MSW** (API mocking in tests)
- **ESLint** + **Prettier** (code quality)

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Running HA DXL Backend at `http://localhost:8080`

### Setup

```bash
cd Frontend
npm install
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL
npm run dev
```

### Environment Variables

```
VITE_API_BASE_URL=http://localhost:8080
```

### Available Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Type-check and build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checker
npm run test         # Run Jest tests with coverage
npm run test:watch   # Run Jest in watch mode
```

### Docker

```bash
docker build -t ha-dxl-frontend .
docker run -p 8080:8080 ha-dxl-frontend
```

## Project Structure

See `src/` for feature-based folder layout as defined in LLD Section 7.1.

## Authentication

JWT tokens are stored in HttpOnly cookies set by the backend. The frontend never accesses tokens directly. The Axios client automatically handles token refresh on 401 responses.

## Roles

| Role | Access |
|------|--------|
| ADMIN | Full access to all features |
| USER | Devices (assigned), Rooms, Automations (own), Telemetry |
| GUEST | Read-only access to granted devices and rooms |
