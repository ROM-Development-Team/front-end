import { BrowserRouter as Router } from 'react-router-dom';
import DeviceGate from './components/deviceGate';

function App() {
  return (
    <Router>
      <DeviceGate />
    </Router>
  );
}

export default App;