import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home'; 
import Card1 from './Components/Cards/Card1';
import Card2 from './Components/Cards/Card2';
import Card3 from './Components/Cards/Card3';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card1" element={<Card1 />} />
        <Route path="/card2" element={<Card2 />} />
        <Route path="/card3" element={<Card3 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
