import { useGoogleLogin } from '@react-oauth/google';


function GoogleFitComponent({ handleLoginSuccess }) {
  const login = useGoogleLogin({
    onSuccess: async response => {
    //   console.log("Authorization code response:", response);

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: response.code,
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
          redirect_uri: 'http://localhost:3000',
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
    redirect_uri: 'http://localhost:3000',
  });

  return (
    <button onClick={() => login()}>
      Get Data from Google Fit 
    </button>
  );
}

export default GoogleFitComponent;