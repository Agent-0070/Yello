import { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import AuthService from '../services/auth';

interface AuthWrapperProps {
  children: React.ReactNode;
}

type AuthMode = 'login' | 'register';

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authState = AuthService.getAuthState();
    setIsAuthenticated(authState.isAuthenticated);
    setIsLoading(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        {authMode === 'login' ? (
          <LoginForm 
            onToggleMode={toggleAuthMode}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <RegisterForm 
            onToggleMode={toggleAuthMode}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
}