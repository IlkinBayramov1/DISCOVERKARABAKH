import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import ErrorPage from './ErrorPage';

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  console.error("Route Error:", error);

  if (isRouteErrorResponse(error)) {
    // Handle specific status codes
    return (
      <ErrorPage 
        status={error.status} 
        message={error.statusText || error.data?.message} 
      />
    );
  }

  // Handle runtime errors (not route responses)
  const errorMessage = error instanceof Error ? error.message : 'Bilinməyən xəta baş verdi';
  
  return (
    <ErrorPage 
      status={500} 
      title="Sistem Xətası" 
      message={errorMessage} 
    />
  );
};

export default ErrorBoundary;
