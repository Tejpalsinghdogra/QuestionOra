import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './feedbackform.css';

function Feedback() {
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState('');
  const [options, setOptions] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/signup');
    }
  }, [token, navigate]);


  const validateFf = async (e) => {
    e.preventDefault();
    if (!rating && options.length === 0) {
      setErrorMsg("Kindly input atleast one field");
      return;
    }

    setErrorMsg('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, options, feedbackText }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setErrorMsg(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      setErrorMsg('Server error. Please try again later.');
    }
  };

  const handleOptionChange = (value) => {
    setOptions(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <main>
      <div className="containerm">
        <div id="qoh">QuestionOra</div>
        <div id="wysh">Feedback Form</div>
      </div>
      
      {!success ? (
        <div className="containerfef">
          <div className="iff">
            <div className="fffh">
              <div className="yoe">How is your overall experience?!</div>
              <div className="syb">It will help us to serve you better</div>
            </div>
            <form id="feedf" onSubmit={validateFf}>
              <div className="ffem">
                <label>
                  <input type="radio" name="rating" id="id1" value="1" hidden checked={rating === '1'} onChange={(e) => setRating(e.target.value)} />
                  <span className="emoji">😡</span>
                </label>
                <label>
                  <input type="radio" name="rating" id="id2" value="2" hidden checked={rating === '2'} onChange={(e) => setRating(e.target.value)} />
                  <span className="emoji">😕</span>
                </label>
                <label>
                  <input type="radio" name="rating" id="id3" value="3" hidden checked={rating === '3'} onChange={(e) => setRating(e.target.value)} />
                  <span className="emoji">😐</span>
                </label>
                <label>
                  <input type="radio" name="rating" id="id4" value="4" hidden checked={rating === '4'} onChange={(e) => setRating(e.target.value)} />
                  <span className="emoji">🙂</span>
                </label>
                <label>
                  <input type="radio" name="rating" id="id5" value="5" hidden checked={rating === '5'} onChange={(e) => setRating(e.target.value)} />
                  <span className="emoji">😍</span>
                </label>
              </div>
              <div className="cwiw">
                <div className="wiw">What is wrong?!</div>
              </div>
              <div className="ffcb">
                <label>
                  <input type="checkbox" name="options" value="Slow loading" id="cid1" hidden checked={options.includes('Slow loading')} onChange={() => handleOptionChange('Slow loading')} />
                  <div className={`chb1 ${options.includes('Slow loading') ? 'active' : ''}`}>Slow loading</div>
                </label>
                <label>
                  <input type="checkbox" name="options" value="Bad Navigation" id="cid2" hidden checked={options.includes('Bad Navigation')} onChange={() => handleOptionChange('Bad Navigation')} />
                  <div className={`chb2 ${options.includes('Bad Navigation') ? 'active' : ''}`}>Bad navigation</div>
                </label>
                <label>
                  <input type="checkbox" name="options" value="Login Issue" id="cid3" hidden checked={options.includes('Login Issue')} onChange={() => handleOptionChange('Login Issue')} />
                  <div className={`chb3 ${options.includes('Login Issue') ? 'active' : ''}`}>Login issue</div>
                </label>
                <label>
                  <input type="checkbox" name="options" value="Downloading problem" id="cid4" hidden checked={options.includes('Downloading problem')} onChange={() => handleOptionChange('Downloading problem')} />
                  <div className={`chb4 ${options.includes('Downloading problem') ? 'active' : ''}`}>Downloading problem</div>
                </label>
                <label>
                  <input type="checkbox" name="options" value="Bad UI" id="cid5" hidden checked={options.includes('Bad UI')} onChange={() => handleOptionChange('Bad UI')} />
                  <div className={`chb5 ${options.includes('Bad UI') ? 'active' : ''}`}>Bad UI</div>
                </label>
                <label>
                  <input type="checkbox" name="options" value="Others" id="cid6" hidden checked={options.includes('Others')} onChange={() => handleOptionChange('Others')} />
                  <div className={`chb6 ${options.includes('Others') ? 'active' : ''}`}>Others</div>
                </label>
              </div>
              <div className="fftb">
                <textarea name="Textbox" id="fftbn" placeholder="Enter your text here" className={options.includes('Others') ? 'show' : ''} value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)}></textarea>
              </div>
              <div className="containerffsb">
                <button type="submit" value="submit" id="ffsb">Submit</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="containerss">
          <div className="ssff">
            <div className="bfsf">
              <div className="img">
                <img src="/images/check_40dp_002B5B_FILL0_wght400_GRAD0_opsz40-removebg-preview.png" alt="checkicon" />
              </div>
            </div>
            <div className="fss">Feedback submitted successfully</div>
            <div className="tfyvt">Thank you for your valuable time!</div>
          </div>
        </div>
      )}

      {errorMsg && !success && (
        <div className="containeremff">
          <span id="errormsg" style={{ color: 'red' }}>{errorMsg}</span>
        </div>
      )}
    </main>
  );
}

export default Feedback;
