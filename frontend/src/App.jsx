import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { AuthProvider, UserProvider } from './components/utils/context'
import Home from './pages/Home'
import AccueilHopital from './components/AccueilHopital'

function App() {

    return (
      <AuthProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/Accueil_Hopital' element={<AccueilHopital/>} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </AuthProvider>
    )
}

export default App
