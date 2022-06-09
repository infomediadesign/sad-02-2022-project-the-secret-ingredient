import { authenticateMe } from '../ViewModels/Login';
import  '../styles/Login.scss';
import { useNavigate } from 'react-router-dom';
import {bordMainSetup} from '../ViewModels/Board'
import { format } from 'path';

export function App() {
    let navigate = useNavigate();
    let pass = '123456789';
    let username = 'test12';
    let email = 'test@test.com';

    const getUserValue = (event: any) => {
        // show the user input value to console
        username = event.target.value;
    };
    const setPassValue = (event: any) => {
        // show the user input value to console
        pass = event.target.value;
    };
    const setEmail = (event: any) => {
        // show the user input value to console
        email = event.target.value;
    };

    return (
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <div className="user-box">
            <input type="text" />
            <label>Username</label>
          </div>
          <div className="user-box">
            <input type="password" />
            <label>Password</label>
          </div>
          <button type='submit'>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            submit
          </button>
        </form>
      </div>
    );
}

export default App;
