import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../store/context/UserProfileContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useUserProfile();

  const handleLogout = () => {
    localStorage.removeItem('Authorization');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    if (!token) {
      navigate('/');
      return;
    }

    if (!profile && !isLoading) {
      navigate('/');
    }
  }, [navigate, profile, isLoading]);

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    localStorage.removeItem('Authorization');
    return;
  }

  return (
    <div>
      <h1>Welcome, {profile.username}!</h1>
      <p>ID: {profile.profile_id}</p>
      <p>Email: {profile.email}</p>
      <p>Google ID: {profile.google_id || 'Not linked'}</p>
      <p>Google Email: {profile.google_email || 'Not linked'}</p>
      <p>Score: { profile.score }</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LandingPage;