// React
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PageTransition from './utils/pageTransition';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CLIENT_ID } from '../api/env';

// Components
import LoadingScreen from './components/loadingScreen';
import InstallPrompt from './components/installPrompt';
import PushNotificationBanner from './components/pushNotificationbanner';

// Utils
import ProtectedRoute from './utils/protectedRoute';

// Auth
const LoginForm = lazy(() => import('./auth/login'));
const RegisterForm = lazy(() => import('./auth/register'));
const ForgotPasswordForm = lazy(() => import('./auth/forgot'));
const ResetPasswordForm = lazy(() => import('./auth/reset'));

// User
const Home = lazy(() => import('./pages/home'));
const PostRant = lazy(() => import('./pages/post'));
const Discover = lazy(() => import('./pages/discover'));
const Notifications = lazy(() => import('./pages/notifications'));
const Profile = lazy(() => import('./pages/profile'));

// 404
const NotAuthorized = lazy(() => import('./utils/notAuthorized'));
const NotFound = lazy(() => import('./utils/notFound'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <PageTransition key={location.pathname}>
        <Suspense fallback={<LoadingScreen/>}>
          <Routes location={location}>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot" element={<ForgotPasswordForm />} />
            <Route path="/reset" element={<ResetPasswordForm />} />
            
            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route path="*" element={<NotFound />} />
            
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/post" element={<ProtectedRoute><PostRant /></ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </Suspense>
        <InstallPrompt />
        <PushNotificationBanner />
      </PageTransition>
    </GoogleOAuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
