import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/signup.css';

function Signup() {
  const [infoMsg, setInfoMsg] = useState('');
  const [focused, setFocused] = useState({ name: false, email: false, password: false, confirm: false });
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [agreed, setAgreed] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleFocus = (field) => setFocused(prev => ({ ...prev, [field]: true }));
  const handleBlur = (field) => setFocused(prev => ({ ...prev, [field]: false }));
  const handleChange = (field, e) => setValues(prev => ({ ...prev, [field]: e.target.value }));

  const validateForm = async (e) => {
    e.preventDefault();
    if (values.password !== values.confirm) {
      setInfoMsg("Passwords do not match");
      return;
    }

    if (!agreed) {
      setInfoMsg("You must agree to the terms of use and privacy policies");
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
      });
      const data = await response.json();
      if (response.ok) {
        setInfoMsg("Signed up successfully! Redirecting to home...");
        if (rememberMe) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('user', JSON.stringify(data));
        }
        setTimeout(() => navigate('/'), 1500);
      } else {
        setInfoMsg(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setInfoMsg("Server error");
    }
  };

  return (
    <main>
      <div className="containerm">
        <div id="qoh">QuestionOra</div>
        <div id="wysh">SignUp</div>
      </div>
      <div className="containersu">
        <div className="icsu">
          <form onSubmit={validateForm}>
            <div className="eicsush" id="fhca">Create Account</div>
            <div className="eicsu">
              <span className={`nv ${focused.name || values.name ? 'hoverup' : ''}`} id="fn">Enter your Name</span>
              <input className="tbs" id="fntb" type="text" onFocus={() => handleFocus('name')} onBlur={() => handleBlur('name')} onChange={(e) => handleChange('name', e)} value={values.name} />
            </div>
            <div className="eicsu">
              <span className={`nv ${focused.email || values.email ? 'hoverup' : ''}`} id="ye">Enter your Email</span>
              <input className="tbs" id="etb" type="email" onFocus={() => handleFocus('email')} onBlur={() => handleBlur('email')} onChange={(e) => handleChange('email', e)} value={values.email} />
            </div>
            <div className="eicsu">
              <span className={`nv ${focused.password || values.password ? 'hoverup' : ''}`} id="ep">Enter Password</span>
              <input className="tbs" id="ptb" type="password" onFocus={() => handleFocus('password')} onBlur={() => handleBlur('password')} onChange={(e) => handleChange('password', e)} value={values.password} />
            </div>
            <div className="eicsu">
              <span className={`nv ${focused.confirm || values.confirm ? 'hoverup' : ''}`} id="cp">Confirm Password</span>
              <input className="tbs" id="cptb" type="password" onFocus={() => handleFocus('confirm')} onBlur={() => handleBlur('confirm')} onChange={(e) => handleChange('confirm', e)} value={values.confirm} />
            </div>
            <div className="eicsus">
              <input type="checkbox" id="fcc" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span className="ses">I agree to all the terms of use and privacy policies</span>
            </div>
            <div className="eicsus">
              <input type="checkbox" id="ftc" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <span className="ses">Remember me</span>
            </div>
            <div className="eicsus">
              <button type="submit" id="sub">SignUp</button>
            </div>
            <div className="form-footer">
              Already have an account? <Link to="/login">Log in</Link>
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

export default Signup;
