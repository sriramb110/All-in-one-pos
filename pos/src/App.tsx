import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Login from './common_component/Login';
import ConfirmPassword from './common_component/ConfirmPassword';
import ShopNavigator from './navigator/ShopNavigator';

function App() {
  const token = sessionStorage.getItem('jsonwebtoken');

  return (
    <div className='overflow-hidden w-screen h-screen'>
    <Router>
      <Routes>
        {!token ? <>
          <Route path="/*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Login />} />
          <Route path="/Setpassword/:token" element={<ConfirmPassword />} />
        </> : <>
          <Route path="/*" element={<ShopNavigator />} />
        </>}
      </Routes>
    </Router>
    </div>
  );
}

export default App;
