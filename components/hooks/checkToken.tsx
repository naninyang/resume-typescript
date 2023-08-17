import axios from 'axios';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

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
        const response = await axios.post('/api/renew', { token: token });
        if (response.data.status === 'success') {
          localStorage.setItem('token', response.data.token);
          Cookies.set('token', response.data.token, { expires: 14 });
        } else {
          localStorage.removeItem('token');
          Cookies.remove('token');
          window.location.href = "/manages/pass";
        }
      } catch (error) {
        console.log('Token renewal failed', error);
        localStorage.removeItem('token');
        Cookies.remove('token');
        window.location.href = "/manages/pass";
      }
    }
  }
}
