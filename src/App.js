import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import List from './components/List';

function App() {
  return (
    <Router>
      <List>
        <Route path="/list" component={List} />
      
        {/* Add more routes as needed */}
      </List>
    </Router>
  );
}

export default App;
