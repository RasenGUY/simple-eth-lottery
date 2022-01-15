import {Router, Routes, Route} from 'react-router-dom';
import { Home } from './pages/home';
import { Header } from './components/navigation';
import {Container} from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Container fluid>
      <Header />
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/*" element={<h1>404 page does not exist</h1>} />
      </Routes>
    </Container>
  );
}

export default App;
