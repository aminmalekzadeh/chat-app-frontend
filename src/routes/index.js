import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';

// components 
import LoadingScreen from '../components/LoadingScreen';
// ----------------------------------------------------------------------
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'chat',
          children: [
            {
              element: (
                <AuthGuard>
                  <Chat />
                </AuthGuard>
              )
            },
            {
              path: 'new', element: (
                <AuthGuard>
                  <Chat />
                </AuthGuard>
              )
            },
            {
              path: ':conversationKey', element: (
                <AuthGuard>
                  <Chat />
                </AuthGuard>
              )
            }
          ]
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        {
          path: 'reset-password',
          element: (
            <GuestGuard>
              <ResetPassword />
            </GuestGuard>
          )
        },
        {
          path: 'verify',
          element: (
            <GuestGuard>
              <VerifyCode />
            </GuestGuard>
          )
        }
      ]
    },
  ]);
}

// IMPORT COMPONENTS


const NotFound = Loadable(lazy(() => import('../pages/Page404')));
// Main
const Chat = Loadable(lazy(() => import('../pages/chat')));
const Login = Loadable(lazy(() => import('../pages/chat/auth/LoginPage')));
const Register = Loadable(lazy(() => import('../pages/chat/auth/RegisterPage')));
const ResetPassword = Loadable(lazy(() => import('../pages/chat/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/chat/auth/VerifyCode')));

