import { Link } from 'react-router-dom';
import '../assets/css/index.css';

function Home() {
  return (
    <main>
      <div className="containerm">
        <div id="qoh">QuestionOra</div>
        <div id="wysh">Welcomes you</div>
        <div id="qocd">QuestionOra is a student-driven platform dedicated to making academic resources - especially previous year question papers of GNA University - easy to access, completely free, and well-organized by department.</div>
      </div>
      <div className="containerb">
        <div className="qph">Lets find your Question Paper!</div>
        <div className="sbh">Kindly select your block</div>
        <div className="containerd">
          <div className="ps1">
            <Link to="/block-a">
              <div className="pds"><img src="/images/IMG_2978.jpg" alt="Block-A" /></div>
            </Link>
            <div className="fsb">Block-A</div>
          </div>
          <div className="ps1">
            <Link to="/block-b">
              <div className="pds"><img src="/images/IMG_2975.jpg" alt="Block-B" /></div>
            </Link>
            <div className="fsb">Block-B</div>
          </div>
          <div className="ps1">
            <Link to="/block-c">
              <div className="pds"><img src="/images/IMG_2981.jpg" alt="Block-C" /></div>
            </Link>
            <div className="fsb">Block-C</div>
          </div>
        </div>
      </div>
      <div className="containerse">
        <div className="seh">Student Essentials - 100% Free</div>
        <div className="seb">
          <div className="sec">Explore a growing collection of previous year question papers.We believe learning should be open to all.</div>
          <div className="sec">That's why every student can freely access, download, and even share our resources.</div>      
          <div className="sec">Let's make learning simple, stress-free, and accessible for everyone.</div>
        </div>
      </div>
      <div className="containerfm">
        <div className="fmh">Your Feedback Matters!</div>
        <div className="fmb">
          <div className="fmc">Help us serve you better.</div>
          <div className="fmc">As we provide you with access to previous year question papers and valuable academic content, we'd love to hear from you in return.</div>
          <div className="fmc">Your feedback helps us understand what works, what doesn't, and how we can improve the platform to serve students even better.</div>
          <div className="fmc">Please take a moment to share your thoughts — your suggestions truly shape the future of this website.</div>
          <Link to="/feedback"><button id="fbb">Feedback</button></Link>
        </div>
      </div>
    </main>
  );
}

export default Home;
