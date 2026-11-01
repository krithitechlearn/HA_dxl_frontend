/**
 * Loading spinner component.
 * Shown while data is being fetched.
 */

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ label = 'Loading…', size = 'md' }: LoadingSpinnerProps) {
  const sizeMap = { sm: '1rem', md: '2rem', lg: '3rem' };
  return (
    <div
      role="status"
      aria-label={label}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}
    >
      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          border: '3px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span className="sr-only">{label}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
