import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Username from './pages/Username';
import LandingPage from './pages/LandingPage';
import { UserProfileProvider } from './store/context/UserProfileContext';
import './styles/App.css'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Registration />} />
        <Route path='/username' element={<Username />} />
        <Route
          path='/landing'
          element={
            <UserProfileProvider> 
              <LandingPage />
            </UserProfileProvider>
          }
        />
      </Routes>
    </div>
  )
}

export default App
