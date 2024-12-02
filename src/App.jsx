import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ItemList from './pages/Items/ItemList';
import ItemForm from './pages/Items/ItemForm';
import BOMList from './pages/BOM/BOMList';
import BOMForm from './pages/BOM/BOMForm';
import Navbar from './components/Navbar';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/items" element={<ItemList />} />
        <Route path="/items/new" element={<ItemForm />} />
        <Route path="/items/:id" element={<ItemForm />} />
        <Route path="/bom" element={<BOMList />} />
        <Route path="/bom/new" element={<BOMForm />} />
      </Routes>
    </Router>
  );
};

export default App;