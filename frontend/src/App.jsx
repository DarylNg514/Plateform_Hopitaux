import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider, UserProvider, ThemeProvider } from './components/utils/context';
import Home from './pages/Home';
import AccueilHopital from './components/AccueilHopital';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/Accueil_Hopital' element={<AccueilHopital />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
