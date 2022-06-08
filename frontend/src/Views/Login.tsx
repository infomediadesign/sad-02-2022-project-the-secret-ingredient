import { authenticateMe } from '../ViewModels/Login';
import '../styles/Login.scss';
import { useNavigate } from 'react-router-dom';
import {bordMainSetup} from '../ViewModels/Board'

export function App() {
    let navigate = useNavigate();
    let pass = '123456789';
    let username = 'test1';
    let email = 'tes555t@test.com';

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
        <div>
            <div>
                <label className="label">Email</label>
                <input onChange={setEmail} placeholder={email}></input>
            </div>
            <div>
                <label className="label">Password</label>
                <input type={'password'} onChange={setPassValue} placeholder={pass}></input>
            </div>
            <button
                className="btn-primary"
                onClick={async (e) => {
                    if (await authenticateMe(username, pass, email)) {
                        await bordMainSetup(0);
                        await navigate('/Board');
                    } else {
                        alert('Wrong login info');
                    }
                }}
            >
                Login
            </button>
            <button className="btn-primary" onClick={() => {navigate('/Signup');}}>Sign Up</button>
        </div>
    );
}

export default App;
