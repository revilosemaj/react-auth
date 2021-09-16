import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthenticationProvider } from './store/Auth-context';
import './index.css';
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    <AuthenticationProvider>
      <App />
    </AuthenticationProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
