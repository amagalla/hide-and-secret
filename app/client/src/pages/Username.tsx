import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import axios from 'axios';
import '../styles/Login.css';

const Username = () => {
    const [usernameData, setUsernameData] = useState({
        username: ''
    });

    
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    const { id } = location.state || {};
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUsernameData({
            ...usernameData,
            [name]: value
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const resp = await apiClient.patch(`/profiles/${id}/username`, usernameData);

            localStorage.setItem('Authorization', resp.data.token);
            navigate('/landing');
        } catch (err: unknown) {
            if (err instanceof Error) {
                if (axios.isAxiosError(err)) {
                    const data = err.response?.data;
                    setErrorMessage(data.message);
                }
            }
        }
    };

    return (
        <div className="login-container">
            <div className='registration-header'>
                <h1>Create a Username</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={usernameData.username}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Submit Username</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p
                onClick={() => navigate('/')}
                className='btn-register'
            >
                Back to Login
            </p>
        </div>
    );
};

export default Username;