import {Routes, Route} from 'react-router-dom';
import { Home } from './pages/home';
import { Header } from './components/navigation';
import {Container} from 'react-bootstrap';
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
