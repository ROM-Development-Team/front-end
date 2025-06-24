import { endpoints } from './config';
import { messaging, getToken } from './fb-config';

export const requestPermissionAndSaveToken = async (user_id) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const fcmToken = await getToken(messaging, {
        // vapidKey: 'BAtkEsd5OvvTjsyasQex2HFLJ2Kq3030JJe9jqzxtUFwWdtGBWvl_52PtppgI8vxw_-kNv6AhljsvgPNrHbTsXc'
        vapidKey: 'BA0UtXiKaudoWHqbZZJX48e6pGYQpYFeUDM3TXsbeqZkLdz6jv1DhjmANkUakLBadajCXjxSz5v-Vw1HEqWBirc'
      });

      if (fcmToken) {
        const response = await fetch(`${endpoints.push}/save-fcm-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id,
            fcm_token: fcmToken
          })
        });

        const data = await response.json();
      }
    } else {
      console.warn("Notification permission not granted.");
    }
  } catch (err) {
    console.error("FCM error:", err);
  }
};

