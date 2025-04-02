import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import axios from 'axios';
import '../styles/Login.css';

const Registration = () => {
  const [regData, setRegData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRegData({
      ...regData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const resp = await apiClient.post('/profiles/register', regData);

      navigate('/username', { state: { profile_id: resp.data.profile_id } });
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
        <h1>Create an account</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={regData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={regData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Register</button>
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

export default Registration;