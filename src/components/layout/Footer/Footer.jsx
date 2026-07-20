import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="containerfl">
        <div className="ffw">
          <div className="flc" id="fls">
            <div className="flh">Legal</div>
            <div><Link to="/tou">Terms of use</Link></div>
            <div><Link to="/csp">Content sharing policy</Link></div>
            <div><Link to="/pp">Privacy policy</Link></div>
          </div>
          <div className="flc" id="frm">
            <div className="flh">Connect</div>
            <div><Link to="#">Email</Link></div>
            <div><Link to="#">Instagram</Link></div>
            <div><Link to="#">Linkedin</Link></div>
          </div>
          <div className="flc" id="flcc">
            <div className="flh">Copyright@QuestionOra</div>
            <div className="flh">All Rights reserved</div>        
            <div className="flh">From Students, With ❤️</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
