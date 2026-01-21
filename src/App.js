import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import Layout from './Components/Layout';
import Routes from './Components/Routes';
import 'react-tooltip/dist/react-tooltip.css'

function App() {
  return (
    <Layout>
      <Routes />
    </Layout>
  );
}

export default App;
