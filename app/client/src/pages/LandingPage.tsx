import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('Authorization');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      <h1>This is the landing page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LandingPage;
