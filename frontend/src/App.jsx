import './App.css'
import Register from './components/Register'
import Navbar from './components/Navbar'
import Chats from './components/chats/Chats'
import Login from './components/Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {

  return (
    <>
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chats" element={<Chats />} />
        </Routes>
      </>
    </Router>
    </>
  )
}

export default App
