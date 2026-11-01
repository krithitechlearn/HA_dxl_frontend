/**
 * AuditLogTable tests.
 * @see US-011, API-035
 */
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AuditLogTable } from '../components/AuditLogTable';
import type { AuditLogResponse } from '../types/audit.types';

expect.extend(toHaveNoViolations);

const mockLogs: AuditLogResponse[] = [
  {
    id: 'log-1',
    actorUsername: 'admin',
    action: 'CREATE',
    entityType: 'DEVICE',
    entityId: 'device-uuid-1234',
    ipAddress: '192.168.1.1',
    occurredAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'log-2',
    actorUsername: 'user1',
    action: 'UPDATE',
    entityType: 'AUTOMATION_RULE',
    entityId: 'rule-uuid-5678',
    occurredAt: '2025-01-01T11:00:00Z',
  },
];

const mockPagedData = {
  content: mockLogs,
  totalElements: 2,
  totalPages: 1,
  number: 0,
  size: 20,
};

describe('AuditLogTable [US-011]', () => {
  const mockOnPageChange = jest.fn();
  const mockOnPageSizeChange = jest.fn();

  it('should render audit log entries', () => {
    render(
      <AuditLogTable
        data={mockPagedData}
        currentPage={0}
        pageSize={20}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />,
    );
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('CREATE')).toBeInTheDocument();
    expect(screen.getByText('DEVICE')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
  });

  it('should show empty state when no logs', () => {
    render(
      <AuditLogTable
        data={null}
        currentPage={0}
        pageSize={20}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />,
    );
    expect(screen.getByText(/no audit log entries found/i)).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <AuditLogTable
        data={mockPagedData}
        currentPage={0}
        pageSize={20}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
