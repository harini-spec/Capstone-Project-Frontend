import { useGoogleLogin } from '@react-oauth/google';
import { useSecrets } from '../hooks/useSecrets';

function GoogleFitComponent({ handleLoginSuccess }) {

  const Secret = useSecrets();

  const login = useGoogleLogin({
    onSuccess: async response => {

      // Exchange authorization code for access token
      
      console.log('Authorization code:', response.code);
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: response.code,
          client_id: Secret.clientId,
          client_secret: Secret.clientSecret,
          redirect_uri: 'https://salmon-mushroom-0e8dc301e.5.azurestaticapps.net',
          grant_type: 'authorization_code',
        }),
      });

      
      const tokenData = await tokenResponse.json();
      if (tokenData.access_token) {
        handleLoginSuccess(tokenData.access_token);
      } else {
        console.error('Error fetching access token:', tokenData);
      }
    },
    onError: errorResponse => {
      console.error("Login Failed:", errorResponse);
    },
    flow: 'auth-code', // Explicitly using authorization code flow
    scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.nutrition.read https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.blood_pressure.read https://www.googleapis.com/auth/fitness.sleep.read',
    redirect_uri: 'https://salmon-mushroom-0e8dc301e.5.azurestaticapps.net',
  });

  return (
    <button onClick={() => login()}>
      Get Data from Google Fit 
    </button>
  );
}

export default GoogleFitComponent;