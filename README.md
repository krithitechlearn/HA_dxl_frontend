# Home Automation DXL Frontend

React 18 + TypeScript single-page application for the Home Automation Device Experience Layer (DXL) platform.

## Tech Stack

- React 18.2
- TypeScript 5.3 (strict mode)
- Vite 5.0
- React Router v6
- Axios (API client)
- React Hook Form + Zod (forms and validation)
- Zustand (auth state management)
- Recharts (telemetry visualization)
- Jest + React Testing Library (testing)
- MSW (API mocking)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:8080 (or configure VITE_API_BASE_URL)

### Installation

```bash
npm install
```

### Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your backend API URL:

```
VITE_API_BASE_URL=http://localhost:8080
```

### Development

```bash
npm run dev
```

Application runs at http://localhost:3000

### Build

```bash
npm run build
```

Production build output in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Testing

```bash
# Run all tests with coverage
npm test

# Watch mode
npm run test:watch
```

### Linting and Type Checking

```bash
# ESLint
npm run lint

# TypeScript type check
npm run type-check
```

## Project Structure

```
src/
  features/          # Feature modules (auth, users, devices, etc.)
  components/        # Shared UI components
  services/          # API service layer
  store/             # Zustand stores
  routes/            # Routing configuration
  hooks/             # Custom hooks
  types/             # TypeScript type definitions
  utils/             # Utility functions
  tests/             # Test setup and mocks
```

## Key Features

- JWT authentication with HttpOnly cookies
- Role-based access control (ADMIN, USER, GUEST)
- Device management and control
- Real-time telemetry visualization
- Automation rule creation and management
- Audit log viewing
- Responsive design
- WCAG 2.1 AA accessibility

## User Roles

- **ADMIN**: Full system access
- **USER**: Manage own devices and automations
- **GUEST**: Read-only access to shared devices

## Default Login Credentials

Refer to backend seed data for default admin credentials.

## License

Proprietary - Home Automation DXL Platform