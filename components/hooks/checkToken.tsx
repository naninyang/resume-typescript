import axios from 'axios';
import jwt from 'jsonwebtoken';

export async function checkToken() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  const token = localStorage.getItem('token');

  if (token) {
    const decodedToken = jwt.decode(token);

    const currentTime = Date.now().valueOf() / 1000;
    if ((decodedToken as any).exp < currentTime + 5 * 60) {
      try {
        const response = await axios.post('/api/users/renew', { token: token });
        if (response.data.status === 'success') {
          localStorage.setItem('token', response.data.token);
        } else {
          localStorage.removeItem('token');
          window.location.href = "/login";
        }
      } catch (error) {
        console.log('Token renewal failed', error);
        localStorage.removeItem('token');
        window.location.href = "/login";
      }
    }
  }
}
