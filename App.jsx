import { Routes, Route } from 'react-router-dom';
import InvestPage from './pages/invest';

function App() {
  return (
    <Routes>
      <Route path="/invest" element={<InvestPage />} />
    </Routes>
  );
}

export default App; 