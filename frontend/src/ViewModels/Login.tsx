import { useNavigate } from 'react-router-dom';
import { userID, setUserID } from '../ViewModels/Get';
interface loginData {
    jsx: string;
}

export async function authenticateMe(userName: String, userPass: String, email: String) {
    var result = await getUsers(userName, userPass, email);
    if (result.jwt == undefined) {
        return false;
    } else {
        setUserID(result._id);
        localStorage.setItem('jwt', result.jwt);
        return true;
    }
}

export async function getUsers(userName: String, userPass: String, email: String) {
    var url = 'http://localhost:1234/login';
    var token =
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTQ1Mjg0NTMsImlzcyI6InRlc3QxIn0.9j-HhbqLVM38X489Y8uSNv2jSw6beIgzi1__5WJwWMvAstFj6jTS0Mz7cQwyW2P295vfJQ8dliY1jX_eCtpkFg';

    try {
        /*const requestOptions = {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTQ1Mjg2MTAsImlzcyI6InRlc3QxIn0.-2xZYUqMpQBbAScKeVVx1sjpPKrtLFRP8A9hDxYpIiZtW3NwdZKSWIRA_00IuwC8WR1SNLgUw9AvfU99XUr97g`,
            }),
        };
        console.log(await fetch(url, requestOptions).then((data) => {
            return data.json();
        }));*/

        const requestOptions = {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ email: email, password: userPass }),
        };

        return await fetch(url, requestOptions).then((data) => {
            return data.json();
        });

        /*
        let result = fetch(url, requestOptions).then((data) => {
            return data.json();
        });

        return result;*/
    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
            return error.message;
        } else {
            console.log('unexpected error: ', error);
            return 'An unexpected error occurred';
        }
    }
}
