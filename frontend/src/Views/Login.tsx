import { authenticateMe } from '../ViewModels/Login';
import '../styles/Login.scss';
import { useNavigate } from 'react-router-dom';

export function App() {
    let navigate = useNavigate();
    let pass = '';
    let username = '';

    const getUserValue = (event: any) => {
        // show the user input value to console
        username = event.target.value;
    };
    const setPassValue = (event: any) => {
        // show the user input value to console
        pass = event.target.value;
    };

    return (
        <div>
            <div>
                <label className="label">User Name</label>
                <input onChange={getUserValue}></input>
            </div>
            <div>
                <label className="label">Password</label>
                <input onChange={setPassValue}></input>
            </div>
            <button
                className="btn-primary"
                onClick={(e) => {
                    if (authenticateMe(username, pass)) {
                        navigate('/Board');
                    }
                }}
            >
                Login
            </button>
        </div>
    );
}

export default App;
