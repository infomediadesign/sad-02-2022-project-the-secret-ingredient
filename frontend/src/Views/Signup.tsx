import { signupUser } from '../ViewModels/Signup';
import '../styles/Signup.scss';
import { useNavigate } from 'react-router-dom';
import { bordMainSetup } from '../ViewModels/Board';
import { useEffect } from 'react';
import { jwtSet } from '../util';

export function App() {
    let navigate = useNavigate();
    let pass = '123456789';
    let passCon = '123456789';
    let username = 'test1';
    let email = 'test@test.com';

    useEffect(() => {
        if (jwtSet()) {
            navigate('/board');
        }
    }, []);

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
        <div className="signup-box">
            <h2>SignUP</h2>
            <form>
                <div className="signup-form">
                    <input onChange={getUserValue} placeholder={username}></input>
                    <label className="label">User Name</label>
                </div>
                <div className="signup-form">
                    <input onChange={setEmail} placeholder={email}></input>
                    <label className="label">Email</label>
                </div>
                <div className="signup-form">
                    <input type={'password'} onChange={setPassValue} placeholder={pass}></input>
                    <label className="label">Password</label>
                </div>
                <div className="signup-form">
                    <input type={'password'} onChange={setPassConValue} placeholder={passCon}></input>
                    <label className="label">Confirm Password</label>
                </div>
                <button
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Cancel
                </button>
                <button
                    onClick={async (e) => {
                        e.preventDefault();
                        if (pass != passCon) {
                            alert("password and confirmation dosn't match");
                        } else if (await signupUser(username, pass, email)) {
                            await bordMainSetup(0);
                            navigate('/board');
                        } else {
                            alert('improper login info');
                        }
                    }}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default App;
