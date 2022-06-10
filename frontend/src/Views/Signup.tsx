import { signupUser } from '../ViewModels/Signup';
import '../styles/Login.scss';
import { useNavigate } from 'react-router-dom';
import {bordMainSetup} from '../ViewModels/Board'

export function App() {
    let navigate = useNavigate();
    let pass = '123456789';
    let passCon = '123456789';
    let username = 'test1';
    let email = 'test@test.com';

    const getUserValue = (event: any) => {
        // show the user input value to console
        username = event.target.value;
    };
    const setPassValue = (event: any) => {
        // show the user input value to console
        pass = event.target.value;
    };
    const setPassConValue = (event: any) => {
        // show the user input value to console
        passCon = event.target.value;
    };
    const setEmail = (event: any) => {
        // show the user input value to console
        email = event.target.value;
    };

    return (
        <div>
            <div>
                <label className="label">User Name</label>
                <input onChange={getUserValue} placeholder={username}></input>
            </div>
            <div>
                <label className="label">Email</label>
                <input onChange={setEmail} placeholder={email}></input>
            </div>
            <div>
                <label className="label">Password</label>
                <input type={'password'} onChange={setPassValue} placeholder={pass}></input>
            </div>
            <div>
                <label className="label">Confirm Password</label>
                <input type={'password'} onChange={setPassConValue} placeholder={passCon}></input>
            </div>
            <button
                className="btn-primary"
                onClick={() => {
                    navigate('/');
                }}
            >
                Cancel
            </button>
            <button className="btn-primary" onClick={async(e) =>{
                                    if(pass != passCon){
                                        alert("password and confirmation dosn't match");
                                    }
                                    else if (await signupUser(username, pass, email)) {
                                        await bordMainSetup(0);
                                        await navigate('/Board');
                                    } else {
                                        alert('improper login info');
                                    }
                                }}>Sign Up</button>
        </div>
    );
}

export default App;
