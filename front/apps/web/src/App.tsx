import AppRouter from './app/router';
import { AuthProvider } from './shared/context/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;