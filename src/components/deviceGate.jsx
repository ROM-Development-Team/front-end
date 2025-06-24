import { useEffect, useState, lazy, Suspense } from 'react';
import LoadingScreen from './loadingScreen';
import LandingPage from '../pages/landingPage';
import AppRoutes from './appRoutes';

const DeviceGate = () => {
  const [deviceType, setDeviceType] = useState(getDeviceType());

  function getDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const isTouch = navigator.maxTouchPoints > 1 && window.innerWidth < 1024;
    return (isMobile || isTablet || isTouch) ? 'mobile' : 'desktop';
  }

  useEffect(() => {
    const handleResize = () => {
      const newType = getDeviceType();
      setDeviceType(prev => (prev !== newType ? newType : prev));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!deviceType) return null;

  return (
    <Suspense fallback={<LoadingScreen/>}>
      <AppRoutes />
    </Suspense>
  );
};

export default DeviceGate;