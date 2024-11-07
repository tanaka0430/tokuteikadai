import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Chat } from './components/pages/Chat';
import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login';
import { LoginFailed } from './components/pages/LoginFailed';
import { Register } from './components/pages/Register';
import { NotFound } from './components/pages/NotFound';
import { RegisterSucceeded } from './components/pages/RegisterSucceeded';
import { RegisterFailed } from './components/pages/RegisterFailed';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/loginfailed" element={<LoginFailed/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/registersucceeded" element={<RegisterSucceeded/>}/>
          <Route path="/registerfailed" element={<RegisterFailed />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
