
import { BrowserRouter } from 'react-router-dom'
import AppRoute from './routes'
import ScrollToTop from './components/ScrollToTop';


function App() {
  return (
      <BrowserRouter>
        <ScrollToTop/>
        <AppRoute/>
      </BrowserRouter>
  );
}

export default App
