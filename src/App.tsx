import { useAppSelector } from './app/hooks';
import LoginScreen from './features/auth/LoginScreen';
import PlayerScreen from './components/Player/PlayerScreen';
import ErrorBoundary from './components/Error/ErrorBoundary';

function App() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <ErrorBoundary>
      {isAuthenticated ? <PlayerScreen /> : <LoginScreen />}
    </ErrorBoundary>
  );
}

export default App;
