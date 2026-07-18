import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/signup.css';

function Login() {
  const [infoMsg, setInfoMsg] = useState('');
  const [focused, setFocused] = useState({ email: false, password: false });
  const [values, setValues] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleFocus = (field) => setFocused(prev => ({ ...prev, [field]: true }));
  const handleBlur = (field) => setFocused(prev => ({ ...prev, [field]: false }));
  const handleChange = (field, e) => setValues(prev => ({ ...prev, [field]: e.target.value }));

  const validateForm = async (e) => {
    e.preventDefault();
    setInfoMsg('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setInfoMsg('Logged in successfully! Redirecting...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        // Redirect based on role
        setTimeout(() => {
          if (data.role === 'admin') {
            navigate('/admin');
          } else if (data.role === 'teacher') {
            navigate('/teacher');
          } else {
            navigate('/');
          }
        }, 1000);
      } else {
        setInfoMsg(data.message || 'Login failed');
      }
    } catch (error) {
      setInfoMsg('Server error');
      console.error(error);
    }
  };

  return (
    <main>
      <div className="containerm">
        <div id="qoh">QuestionOra</div>
        <div id="wysh">Login</div>
      </div>
      <div className="containersu">
        <div className="icsu">
          <form onSubmit={validateForm}>
            <div className="eicsush" id="fhca">Welcome Back</div>
            <div className="eicsu">
              <span className={`nv ${focused.email || values.email ? 'hoverup' : ''}`} id="ye">Enter your Email</span>
              <input className="tbs" id="etb" type="email" required onFocus={() => handleFocus('email')} onBlur={() => handleBlur('email')} onChange={(e) => handleChange('email', e)} value={values.email} />
            </div>
            <div className="eicsu">
              <span className={`nv ${focused.password || values.password ? 'hoverup' : ''}`} id="ep">Enter Password</span>
              <input className="tbs" id="ptb" type="password" required onFocus={() => handleFocus('password')} onBlur={() => handleBlur('password')} onChange={(e) => handleChange('password', e)} value={values.password} />
            </div>
            <div className="eicsus">
              <button type="submit" id="sub">Login</button>
            </div>
            <div className="form-footer">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
      <div className="containerit">
        <span id="info">{infoMsg}</span>
      </div>
    </main>
  );
}

export default Login;
