import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Bienvenidos } from '../pages';

export const BienvenidosRoutes = () => {
    return (
    <Router>
      <Routes>
        <Route path="/" element={<Bienvenidos />} />
        
      </Routes>
    </Router>
  );
};

