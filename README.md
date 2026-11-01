# Home Automation DXL Frontend

React 18 + TypeScript single-page application for the Home Automation Device Experience Layer (DXL) platform.

## Tech Stack

- **React 18.2** with TypeScript (strict mode)
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **React Hook Form + Zod** - Form management and validation
- **Zustand** - Lightweight state management for auth
- **Recharts** - Telemetry data visualization
- **Jest + React Testing Library** - Testing framework
- **MSW** - API mocking for tests

## Prerequisites

- Node.js 18+ and npm 9+
- Backend API running (see `HA_dxl_backend` repository)

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` to point to your backend API:

```
VITE_API_BASE_URL=http://localhost:8080
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Code Quality

Run ESLint:

```bash
npm run lint
```

Run TypeScript type checking:

```bash
npm run type-check
```

## Project Structure

```
src/
├── features/          # Feature modules (auth, users, devices, etc.)
├── components/        # Shared components
├── services/          # API client and service layer
├── store/             # Zustand stores
├── routes/            # Routing configuration
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── styles/            # Global styles
└── main.tsx           # Application entry point
```

## Default Credentials

See backend documentation for default admin credentials.

## License

Proprietary - Home Automation DXL Platform
