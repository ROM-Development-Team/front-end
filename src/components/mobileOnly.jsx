import DesktopRestricted from './DesktopRestricted';

const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /android|iphone|ipad|ipod/i.test(userAgent) || 
         /tablet/i.test(userAgent) || 
         (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);
};

const MobileOnlyRoute = ({ children }) => {
  return isMobileDevice() ? children : <DesktopRestricted />;
};

export default MobileOnlyRoute;