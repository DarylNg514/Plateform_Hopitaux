import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context';
import { ThemeContext } from '../context';
import axios from 'axios';

export const useAuth = () => {
  return useContext(AuthContext);
};


export function useFetch(url, method = 'GET', data = {}) {
  const [response, setResponse] = useState({});
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
            console.log(response.data)
            response = response.data;
            break;
          case 'POST':
            response = await axios.post(url, data);
            response = response.data;
            break;
          case 'PUT':
            response = await axios.put(url, data);
            response = response.data;
            break;
          case 'DELETE':
            response = await axios.delete(url);
            response = response.data;
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        setResponse(response);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url, method, data]);

  return { isLoading, response, error };
}

export const useTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return { theme, toggleTheme }
}
