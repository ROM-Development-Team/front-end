// React
import { useEffect } from 'react';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PageTransition from '../utils/pageTransition';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CLIENT_ID } from '../../api/env';
import { messaging, onMessage } from '../../api/fb-config';

// Components
import LoadingScreen from './loadingScreen';
import InstallPrompt from '../components/installPrompt';
import MobileOnlyRoute from '../components/mobileOnly';
import MoodExpiryChecker from './moodExpiryChecker';

// Utils
import ProtectedRoute from '../utils/protectedRoute';
import ScrollToTop from '../utils/scrollToTop';

// Auth
const LoginForm = lazy(() => import('../auth/login'));
const RegisterForm = lazy(() => import('../auth/register'));
const ForgotPasswordForm = lazy(() => import('../auth/forgot'));
const ResetPasswordForm = lazy(() => import('../auth/reset'));

// User
const Home = lazy(() => import('../pages/home'));
const PostRant = lazy(() => import('../pages/post'));
const Discover = lazy(() => import('../pages/discover'));
const Notifications = lazy(() => import('../pages/notifications'));
const Profile = lazy(() => import('../pages/profile'));

// Features
const EmotionalThermometer = lazy(() => import('../pages/features/emotionalThermometer'));
const RantsReceived = lazy(() => import('../pages/features/rantsReceived'));
const AnonymousRantWrapper = lazy(() => import('../components/anonymousRantWrapper'));
const SendToVoid = lazy(() => import('../pages/features/sendToVoid'));
const RantAI = lazy(() => import('../pages/features/rantAI'));
const RantVoiceAI = lazy(() => import('../pages/features/rantVoiceAI'));

// 404
const NotAuthorized = lazy(() => import('../utils/notAuthorized'));
const NotFound = lazy(() => import('../utils/notFound'));

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.user_id || !user?.token) {
      console.error("Missing user ID or token");
      return;
    }

    const cacheKey = `rant-inbox-${user?.user_id}`;

    const handleMessage = async (payload) => {
      console.log("Foreground message received:", payload);

      try {
        const cache = await caches.open('rant-cache');
        const cachedResponse = await cache.match(cacheKey);

        if (cachedResponse) {
          const cachedData = await cachedResponse.json();

          // ✅ Add or update the isUpdate field
          const updatedData = {
            ...cachedData,
            isUpdate: true,
            timestamp: Date.now(),
          };

          await cache.put(cacheKey, new Response(JSON.stringify(updatedData)));
          console.log("Updated existing rant-inbox cache with isUpdate: true");
        } else {
          console.warn("No existing cache found to update.");
        }
      } catch (error) {
        console.error("Error setting isUpdate flag in cache:", error);
      }
    };

    const unsubscribe = onMessage(messaging, handleMessage);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <PageTransition key={location.pathname}>
        <Suspense fallback={<LoadingScreen/>}>
          <ScrollToTop/>
          <Routes location={location}>
            {/* Public routes (no MobileOnlyRoute wrapper) */}
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot" element={<ForgotPasswordForm />} />
            <Route path="/reset" element={<ResetPasswordForm />} />
            
            <Route path="/not-authorized" element={<NotAuthorized />} />
            
            {/* Anonymous rant form available on all devices */}
            <Route path="/:username" element={<AnonymousRantWrapper />} />
            
            {/* Mobile-only protected routes */}
            <Route path="/home" element={
              <MoodExpiryChecker>
                <MobileOnlyRoute>
                  <ProtectedRoute><Home /></ProtectedRoute>
                </MobileOnlyRoute>
              </MoodExpiryChecker>
            } />
            <Route path="/post" element={
              <MoodExpiryChecker>
                <MobileOnlyRoute>
                  <ProtectedRoute><PostRant /></ProtectedRoute>
                </MobileOnlyRoute>
              </MoodExpiryChecker>
            } />
            <Route path="/discover" element={
              <MoodExpiryChecker>
                <MobileOnlyRoute>
                  <ProtectedRoute><Discover /></ProtectedRoute>
                </MobileOnlyRoute>
              </MoodExpiryChecker>
            } />
            <Route path="/notifications" element={
              <MoodExpiryChecker>
                <MobileOnlyRoute>
                  <ProtectedRoute><Notifications /></ProtectedRoute>
                </MobileOnlyRoute>
              </MoodExpiryChecker>
            } />
            <Route path="/profile" element={
              <MobileOnlyRoute>
                <ProtectedRoute><Profile /></ProtectedRoute>
              </MobileOnlyRoute>
            } />
            
            {/* Mobile-only feature routes */}
            <Route path="/thermometer" element={
              <MoodExpiryChecker>
                <MobileOnlyRoute>
                  <EmotionalThermometer />
                </MobileOnlyRoute>
              </MoodExpiryChecker>
            } />
            <Route path="/rants" element={
              <MoodExpiryChecker>
                <MobileOnlyRoute>
                  <RantsReceived />
                </MobileOnlyRoute>
              </MoodExpiryChecker>
            } />
            <Route path="/void" element={
              <MoodExpiryChecker>
                <MobileOnlyRoute>
                  <SendToVoid />
                </MobileOnlyRoute>
              </MoodExpiryChecker>
            } />
            <Route path="/rant" element={
              <MoodExpiryChecker>
                <MobileOnlyRoute>
                  <RantAI />
                </MobileOnlyRoute>
              </MoodExpiryChecker>
            } />
            <Route path="/voice" element={
              <MoodExpiryChecker>
                <MobileOnlyRoute>
                  <RantVoiceAI />
                </MobileOnlyRoute>
              </MoodExpiryChecker>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <InstallPrompt />
      </PageTransition>
    </GoogleOAuthProvider>
  );
}

function AppRoutes () {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default AppRoutes;