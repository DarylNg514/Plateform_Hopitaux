import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context';
import { ThemeContext } from '../context';
import axios from 'axios';

export const useAuth = () => {
  return useContext(AuthContext);
};


export function useFetch(url, method = 'GET', data = {}) {
  const [response, setResponse] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utilisez useRef pour stocker l'URL précédente et éviter des appels de fetch en boucle
  const previousUrlRef = useRef();

  useEffect(() => {
    // Si l'URL n'a pas changé, ne faites rien
    if (previousUrlRef.current === url) return;

    // Met à jour l'URL précédente
    previousUrlRef.current = url;
    if (!url) return;

    async function fetchData() {
      try {
        let response;
        switch (method.toUpperCase()) {
          case 'GET':
            response = await axios.get(url);
            console.log(response.data)
            break;
          case 'POST':
            response = await axios.post(url, data);
            break;
          case 'PUT':
            response = await axios.put(url, data);
            break;
          case 'DELETE':
            response = await axios.delete(url);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        setResponse(response.data);
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
