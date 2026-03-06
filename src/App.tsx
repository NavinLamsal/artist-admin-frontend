import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '@/context/UserContext';

const Register = React.lazy(() => import('@/pages/auth/Register'));
const Login = React.lazy(() => import('@/pages/auth/Login'));
const Dashboard = React.lazy(() => import('@/layouts/DashboardLayout'));
const Skeleton = React.lazy(() => import('@/components/Skeleton'));
const Loading = React.lazy(() => import('@/components/Loading'));

import { routes } from '@/utils/routes';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { isAuthenticated, user, loading } = useUserContext();


  if (loading) {
    return (
      <Suspense fallback={<Loading />}>
        <Loading />
      </Suspense>
    );
  }

  const PrivateRoute = ({ Component, roles }: { Component: React.FC; roles: string[] }) => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" />;
    }

    if (!roles.includes(user.role)) {
      console.log("Tried accessing unautonrized page");
      return <Navigate to="/unauthorized" />;
    }

    return <Component />;
  };



  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<SuspenseFallback isAuthenticated={isAuthenticated} />}>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  isAuthenticated ? (
                    <Dashboard>
                      <PrivateRoute Component={route.component} roles={route.roles} />
                    </Dashboard>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            ))}
            <Route
              path="/register"
              element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/"
              element={!isAuthenticated ? <Navigate to="/login" /> : <Navigate to="/dashboard" />}
            />
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer />
    </QueryClientProvider>
  );
};

function SuspenseFallback({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (isAuthenticated) {
      return (
        <Dashboard>
          <Skeleton />
        </Dashboard>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      );
    };
}

export default App;
