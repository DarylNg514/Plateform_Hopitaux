import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signup = async (formData) => {
    try {
      console.log(formData)
      const response = await axios.post('http://localhost:5000/auth/signup', formData);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Error registering new user', error);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', credentials);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Error logging in', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user1');
    try {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("A problem occured with storedUser: ", error)
    }
  }, []);

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('user1', JSON.stringify(newUser));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};