/**
 * Application root component.
 * Composes providers: Router, ToastContainer.
 */
import { AppRouter } from './routes/AppRouter';
import { ToastContainer } from './components/common/ToastContainer';

export default function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
}
