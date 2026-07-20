import { Link } from 'react-router-dom';
import './blockb.css';

function BlockB() {
  return (
    <main>
      <div className="containerm">
        <div id="qoh">Block-B</div>
        <div id="wysh">Select your Undergraduate Course</div>
      </div>
      <div className="badl">
        <div className="Containerfabc">
          <div className="containergbs1">
            <div className="gbsh1">SCHOOL OF ENGINEERING DESIGN & AUTOMATION</div>
            <div className="gbsc1">
              <ul>
                <Link to="/course/btechae"><li className="fln">• B.Tech. Aerospace Engineering</li></Link>
                <Link to="/course/btechce"><li className="fln">• B.Tech. Civil Engineering</li></Link>
                <Link to="/course/btechcse"><li className="fln">• B.Tech. Computer Science & Engineering</li></Link>
                <Link to="/course/btechece"><li className="fln">• B.Tech. Electronics & Communication Engineering</li></Link>
                <Link to="/course/btechec2e"><li className="fln">• B.Tech. Electronics & Computer Engineering</li></Link>
                <Link to="/course/btechmae"><li className="fln">• B.Tech. Mechanical & Automation Engineering</li></Link>
                <Link to="/course/btechrae"><li className="fln">• B.Tech. Robotics & Automation Engineering</li></Link>
              </ul>
            </div>
          </div>
          <div className="containergbs2">
            <div className="gbsh2">SCHOOL OF COMPUTATIONAL SCIENCES</div>
            <div className="gbsc2">
              <ul>
                <Link to="/course/bscit"><li className="sln">• B.Sc Information Technology</li></Link>
                <Link to="/course/bca"><li className="sln">• Bachelors of Computer Application</li></Link>
                <Link to="/course/bscdm"><li className="sln">• B.Sc in Digital Marketing & Social Networks</li></Link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default BlockB;
