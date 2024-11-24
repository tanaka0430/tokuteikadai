import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Chat } from './components/pages/Chat';
import { Home } from './components/pages/Home';
import { Top } from './components/pages/Top';
import { Search } from './components/pages/Search';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/top" element={<Top />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
