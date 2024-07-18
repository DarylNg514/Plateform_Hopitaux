import './App.css'
import Banner from './components/Banner'
import Header from './components/Header'
import { AuthProvider, UserProvider } from './components/utils/context'

function App() {

    return (
      <AuthProvider>
        <UserProvider>
          <Header/>
          <Banner/>
        </UserProvider>
      </AuthProvider>
    )
}

export default App
