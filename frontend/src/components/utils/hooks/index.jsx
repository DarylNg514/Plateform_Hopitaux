import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context';
import { ThemeContext } from '../context';
import axios from 'axios';

export const useAuth = () => {
  return useContext(AuthContext);
};


export function useFetch(url, method = 'GET', data = {}) {
  const [response, setResponse] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) return;

    async function fetchData() {
      try {
        let response;
        switch (method.toUpperCase()) {
          case 'GET':
            response = await axios.get(url);
            console.log('Get request: ', response)
            response = response.data;
            setResponse(response);
            break;
          case 'POST':
            response = await axios.post(url, data);
            response = response.data;
            setResponse(response);
            break;
          case 'PUT':
            response = await axios.put(url, data);
            response = response.data;
            setResponse(response);
            break;
          case 'DELETE':
            response = await axios.delete(url);
            response = response.data;
            setResponse(response);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
      console.log('fetch request: ', response)
    }

    fetchData();
  }, [url, method, data, response]);

  return { isLoading, response, error };
}

export const useTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return { theme, toggleTheme }
}
