import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiClient from '../utils/apiClient';
import '../styles/Login.css'

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setLoginData({
            ...loginData,
            [name]: value
        })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const resp = await apiClient.post('/profiles/login', loginData);
            if (!resp.data.has_username) {
                navigate('/username');
            } else {
                localStorage.setItem('token', resp.data.token);
                navigate('/landing');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                if (axios.isAxiosError(err)) {
                    const data = err.response?.data;
                    setErrorMessage(data.message);
                }
            }
        }
        setLoginData({
            email: '',
            password: '',
        });
    };

    const handleRegister = () => {
        navigate('/register');
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          navigate('/landing');
        }
      }, [navigate]);

    return (
        <div className="login-container">
            <div>
                <h1>Hide and Secret</h1>
            </div>
            <form onSubmit={handleSubmit}>
                Email:
                <input
                    type="text"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    required
                />
                Password:
                <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                />
                <button
                    type="submit"
                >
                    Login
                </button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button
                onClick={handleRegister}
                className="btn-register"
            >
                Or create an account
            </button>
        </div>
    )
};

export default Login;