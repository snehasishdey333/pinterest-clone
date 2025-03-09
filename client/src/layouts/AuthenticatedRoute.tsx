import React from 'react';
import { Outlet } from 'react-router';
import { useAuthStore } from '../store/AuthStore'; // Import the auth store to check the current user
import AuthPage from '../pages/AuthPage';

const AuthenticatedRoute: React.FC = () => {
  const { currentUser } = useAuthStore(); // Access the current user from your store

  // If the user is not authenticated, redirect to the login page (AuthPage)
  if (!currentUser) {
    return <AuthPage/>
  }

  // If authenticated, render the child routes (MainLayout will be wrapped around these)
  return <Outlet />;
};

export default AuthenticatedRoute;
