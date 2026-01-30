import { Routes, Route, Navigate } from 'react-router-dom';
import { Items } from './components/item.jsx';
import { ItemEdit } from './components/itemEdit.jsx';
import TestApi from './components/TestApi.jsx';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/items" replace />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/:id" element={<ItemEdit />} />
        <Route path="/test_api" element={<TestApi />} />
      </Routes>
  );
}

export default App;