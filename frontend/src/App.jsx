import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider, UserProvider, ThemeProvider } from './components/utils/context';
import Home from './pages/Home';
import AccueilHopital from './components/AccueilHopital';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/Accueil_Hopital' element={<AccueilHopital />} />
              </Routes>
            </BrowserRouter>      
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
    
  );
}

export default App;
