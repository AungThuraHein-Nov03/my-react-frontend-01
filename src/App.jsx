import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestApi from './components/TestApi.jsx';

function App() {
  return (
    
      <Routes>
        <Route path="/test_api" element={<TestApi />} />
      </Routes>
  );
}

export default App;