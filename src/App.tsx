/**
 * Root application component.
 * Provides routing and global error boundary.
 * @see US-001 to US-012
 */
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppRouter } from './routes/AppRouter';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  );
}