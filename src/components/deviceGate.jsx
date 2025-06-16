import { useEffect, useState, lazy, Suspense } from 'react';

const LandingPage = lazy(() => import('../pages/landingPage'));
const AppUI = lazy(() => import('../App')); 
const LoadingScreen = lazy(() => import('./loadingScreen')); 

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
      {deviceType === 'desktop' ? <LandingPage /> : <AppUI />}
    </Suspense>
  );
};

export default DeviceGate;
