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
            <input data-testid="email" type="text" onChange={setEmail} placeholder={email}/>
            <label>Username</label>
          </div>
          <div className="user-box" >
            <input data-testid="password" type="password" onChange={setPassValue} placeholder={pass}/>
            <label>Password</label>
            </div>
          
          <button id='login' type='submit' onClick={async (e) => {
                    if (await authenticateMe(username, pass, email)) {
                        await bordMainSetup(0);
                        await navigate('/Board');
                    } else {
                        alert('Wrong login info');
                    }
                }}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Login
          </button>
          <button type='submit' onClick={() => {navigate('/Signup');}}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Signup
          </button>
        </form>
      </div>
    );
}

export default App;
