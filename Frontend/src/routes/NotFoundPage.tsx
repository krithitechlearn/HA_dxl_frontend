/**
 * 404 Not Found page.
 */
import { Link } from 'react-router-dom';
import { COMMON_MESSAGES } from '../messages';

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
        {COMMON_MESSAGES.notFound}
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        {COMMON_MESSAGES.notFoundMessage}
      </p>
      <Link
        to="/"
        style={{
          padding: '0.5rem 1.25rem',
          backgroundColor: '#3b82f6',
          color: '#fff',
          borderRadius: '0.375rem',
          textDecoration: 'none',
        }}
      >
        {COMMON_MESSAGES.goHome}
      </Link>
    </div>
  );
}
