import React, { useEffect } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log('Google Auth Loaded with Client ID:', CLIENT_ID ? 'Exists (Hidden for security)' : 'MISSING');

export default function GoogleLogin({ onLoginSuccess }) {
  useEffect(() => {
    // Standard function to parse JWT payload
    const decodeJwt = (token) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (err) {
        console.error('Failed to decode JWT', err);
        return null;
      }
    };

    const handleCredentialResponse = (response) => {
      const payload = decodeJwt(response.credential);
      if (payload && payload.email) {
        onLoginSuccess({ email: payload.email, token: response.credential });
      } else {
        // Fallback or error logic
        onLoginSuccess({ token: response.credential });
      }
    };

    // Wait until google script has loaded
    const initGoogleLogin = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signIn-btn'),
          { theme: 'outline', size: 'large', type: 'standard', shape: 'pill' }
        );
      } else {
        setTimeout(initGoogleLogin, 100);
      }
    };

    initGoogleLogin();
  }, [onLoginSuccess]);

  return <div id="google-signIn-btn"></div>;
}
