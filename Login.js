import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, useOutletContext } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); 
  const [error, setError] = useState('');
  const { setLoggedIn } = useOutletContext(); 
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Logged in successfully');
        setLoggedIn(true);
        localStorage.setItem('loggedIn', 'true');
        navigate('/community'); 
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Account created successfully');
        navigate('/login');
        setIsLogin(true); 
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-group">
          <label htmlFor="email" className="auth-label">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
        </div>

        <div className="auth-group">
          <label htmlFor="password" className="auth-label">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-button">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <p className="auth-toggle">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          className="auth-toggle-button"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default Login;
