import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ItemList from './pages/Items/ItemList';
import ItemForm from './pages/Items/ItemForm';
import BOMList from './pages/BOM/BOMList';
import BOMForm from './pages/BOM/BOMForm';
import Navbar from './components/Navbar';
import BOMEdit from './pages/BOM/BOMEdit';
import Upload from './pages/Upload/Upload';


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
        <Route path="/bom/edit/:id" element={<BOMEdit />} />
        <Route path='/upload' element={<Upload />} />
      </Routes>
    </Router>
  );
};

export default App;