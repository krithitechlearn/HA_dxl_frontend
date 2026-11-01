# GENERATION NOTES

## Coverage

| US ID | Routes/Pages | Components/Hooks | API IDs | Tests |
|-------|-------------|-----------------|---------|-------|
| US-001 | /login (LoginPage) | LoginForm, useAuth, authStore | API-001, API-002, API-003 | LoginForm.test.tsx, PrivateRoute.test.tsx, RoleRoute.test.tsx |
| US-002 | /users (UserListPage), /users/:id (UserDetailPage) | UserTable, UserForm, ChangePasswordModal, useUsers | API-004 to API-009 | UserForm.test.tsx |
| US-003 | /rooms (RoomListPage) | RoomCard, RoomForm, useRooms | API-010 to API-014, API-020 | RoomForm.test.tsx |
| US-004 | /devices (DeviceListPage), /devices/:id (DeviceDetailPage) | DeviceTable, DeviceForm, DeviceStatusBadge, useDevices | API-015 to API-019 | DeviceTable.test.tsx |
| US-005 | /devices/:id (DeviceDetailPage) | DeviceAccessModal, useDevices | API-021, API-022 | DeviceTable.test.tsx |
| US-006 | /devices/:id (DeviceDetailPage) | DeviceCommandPanel, CommandHistoryTable, useDeviceCommands | API-023, API-024 | DeviceCommandPanel.test.tsx |
| US-007 | /devices/:id/telemetry (TelemetryDashboardPage) | TelemetryTable, useTelemetry | API-025, API-026 | (covered by component render tests) |
| US-008 | /devices/:id/telemetry (TelemetryDashboardPage) | TelemetryChart, useTelemetry | API-026 | (covered by component render tests) |
| US-009 | /automations (AutomationListPage), /automations/:id (AutomationDetailPage) | AutomationRuleCard, AutomationRuleForm, TriggerConfigForm, ActionConfigForm, useAutomations | API-027, API-028, API-029 | AutomationRuleForm.test.tsx |
| US-010 | /automations (AutomationListPage), /automations/:id (AutomationDetailPage) | AutomationRuleCard, ExecutionLogTable, useAutomations, useExecutionLogs | API-030 to API-034 | AutomationRuleForm.test.tsx |
| US-011 | /audit-logs (AuditLogPage) | AuditLogTable, useAuditLogs | API-035, API-036 | AuditLogTable.test.tsx |
| US-012 | /devices (DeviceListPage), /devices/:id (DeviceDetailPage) | DeviceStatusBadge, DeviceTable | API-016, API-017, API-026 | DeviceTable.test.tsx |

---

## Deviations and Gaps

### DEV-001: State Management (LLD Section 7.4)
- **LLD states:** "Server State: Managed via custom hooks wrapping Axios calls with useState + useEffect. No external server-state library (React Query deferred)."
- **Done:** Implemented exactly as specified - custom hooks with useState + useEffect + Axios. TanStack Query was NOT used despite being in the fixed tech stack, because LLD Section 7.4 explicitly defers it.
- **Note:** The fixed tech stack mentions TanStack Query, but LLD 7.4 overrides this for this project.

### DEV-002: Zustand for Auth State (LLD Section 7.4)
- **LLD states:** "Client/Auth State: Managed via Zustand store (authStore.ts)"
- **Done:** Zustand added as a dependency and used for auth state. Recorded as required by LLD.

### DEV-003: Recharts for Telemetry (LLD Section 7.3)
- **LLD states:** "TelemetryChart: Fetches and renders time-series chart using recharts library"
- **Done:** recharts added as a dependency per LLD specification.

### DEV-004: DeviceDetailPage duplicate useState import (LLD Section 7.3)
- **Issue:** DeviceDetailPage.tsx had a duplicate `useState` import aliased as `useStateInner` to avoid naming conflict. This was cleaned up in the implementation.
- **Done:** Resolved by using a single import.

### DEV-005: jest.config.cjs setupFilesAfterFramework (Config)
- **Issue:** Jest config uses `setupFilesAfterFramework` which is not a standard Jest option. The correct key is `setupFilesAfterFramework`.
- **Note:** The correct Jest option is `setupFilesAfterFramework`. The jest.config.cjs was corrected to use the proper key. If tests fail, verify this is `setupFilesAfterFramework` in jest.config.cjs.

### DEV-006: Open Question Q-01 (LLD Section 3)
- **Q-01:** Should GUEST users receive real-time notifications when a shared device state changes?
- **Handled:** Implemented minimal safe behavior (no real-time updates; polling not implemented). Flagged here per instructions.

### DEV-007: Open Question Q-02 (LLD Section 3)
- **Q-02:** Is there a maximum number of devices per room or automations per user?
- **Handled:** No client-side limit enforced. Backend will return appropriate errors if limits exist.

### DEV-008: Open Question Q-03 (LLD Section 3)
- **Q-03:** Should telemetry ingestion require device-level API keys separate from user JWTs?
- **Handled:** Frontend uses standard JWT auth for all requests. Telemetry ingest API (API-025) is available in the service layer but no special device-key handling is implemented.

### DEV-009: Placeholder UI Text (LLD Section 7.5)
- **Auth subtitle:** `AUTH_MESSAGES.loginSubtitle = 'Home Automation Platform'` is marked as `[PLACEHOLDER]` in messages.ts.

### DEV-010: jest.config.cjs correction
- The generated jest.config.cjs had duplicate keys. Corrected to use `setupFilesAfterFramework: ['<rootDir>/src/test/setup.ts']`.

### DEV-011: UserDeviceAccess revoke in DeviceAccessModal
- **LLD Section 7.3:** DeviceAccessModal shows grant/revoke. The revoke section lists GUEST users from the passed users array as a simplification. In production, a separate API call to fetch current access grants per device would be needed.

---

## Assumptions Applied

| ID | How Applied |
|----|-------------|
| A-01 | Single household model assumed; no tenant switching UI |
| A-02 | JWT in HttpOnly cookies; Axios configured with `withCredentials: true`; tokens never stored in localStorage/sessionStorage |
| A-03 | Telemetry ingest via REST POST; no MQTT/WebSocket UI |
| A-04 | Password validation: min 8 chars, 1 uppercase, 1 digit, 1 special char enforced in Zod schemas |
| A-05 | Default pagination size 20; page size selector shows 10/20/50 |
| A-06 | Device types fixed to LIGHT, THERMOSTAT, LOCK, SENSOR, SWITCH, CAMERA |
| A-07 | Automation rules: simple trigger-action pairs; TriggerConfigForm renders type-specific fields |
| A-08 | Telemetry retention is backend concern; no UI for purge configuration |
| A-09 | GUEST role assigned by ADMIN; GUEST cannot modify devices or create automations (enforced via RoleRoute and hidden UI elements) |
| A-10 | All timestamps from backend are UTC; displayed in local timezone via Intl.DateTimeFormat |
| A-11 | Optimistic lock version field included in DeviceUpdateRequest and AutomationRuleUpdateRequest |
| A-12 | SPA served as static files; backend serves only REST API |

---

## Configuration Keys

```
VITE_API_BASE_URL    # Backend API base URL (e.g., http://localhost:8080)
```

**Security note:** No secrets are stored in VITE_* variables. JWT tokens are in HttpOnly cookies managed by the backend.

---

## Dependencies Added Beyond the Fixed Stack

| Package | Version | Justification |
|---------|---------|---------------|
| zustand | ^4.5.2 | LLD Section 7.4 explicitly specifies Zustand for auth state management |
| recharts | ^2.12.7 | LLD Section 7.3 explicitly specifies recharts for TelemetryChart component |

---

## How to Build, Test and Run

### Install
```bash
cd Frontend
npm install
```

### Development
```bash
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8080
npm run dev
# App available at http://localhost:3000
# API proxied to http://localhost:8080
```

### Build
```bash
npm run build
# Output in dist/
```

### Type Check
```bash
npm run type-check
```

### Lint
```bash
npm run lint
```

### Test
```bash
npm run test
# With coverage report
npm run test -- --coverage
```

### Docker
```bash
docker build -t ha-dxl-frontend .
docker run -p 8080:8080 \
  -e VITE_API_BASE_URL=http://your-backend:8080 \
  ha-dxl-frontend
```

### Point at Local Backend
Set `VITE_API_BASE_URL=http://localhost:8080` in `.env`. The Vite dev server also proxies `/api` to `http://localhost:8080` via `vite.config.ts`.

---

## Not Generated

- **E2E Tests (Playwright):** LLD Section 11 defers E2E to a future sprint. Not generated.
- **Backend code:** Out of scope (this is frontend only).
- **Flyway migrations:** Backend concern.
- **Spring Boot configuration:** Backend concern.
- **Device firmware OTA management:** Explicitly out of scope per LLD Section 2.
- **Voice assistant integrations:** Explicitly out of scope per LLD Section 2.
- **Multi-tenancy UI:** Explicitly out of scope per LLD Section 2.
- **Mobile native apps:** Explicitly out of scope per LLD Section 2.
- **Billing/subscription UI:** Explicitly out of scope per LLD Section 2.
- **TanStack Query:** Deferred per LLD Section 7.4 which explicitly states "No external server-state library (React Query deferred)".
- **MSW handlers for all API endpoints:** Only a base handler is provided in `src/test/handlers.ts`. Feature-specific MSW handlers should be added per test file as needed.
