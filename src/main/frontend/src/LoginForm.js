import {useState} from "react";

export default function LoginForm({onLogin, buttonLabel}) {

    const [email, setEmail] = useState('');

    async function handleLogin() {

        const response = await fetch('/api/participants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: email,
                password: ''
            })
        });

        if (
            response.status !== 201 &&
            response.status !== 409
        ) {
            alert('Cannot login');
            return;
        }

        onLogin(email);
    }

    return (
        <div>

            <label>Zaloguj się e-mailem</label>

            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button
                type="button"
                onClick={handleLogin}
            >
                {buttonLabel || 'Wchodzę'}
            </button>

        </div>
    );
}