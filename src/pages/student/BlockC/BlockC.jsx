import { Link } from 'react-router-dom';
import './blockc.css';

function BlockC() {
  return (
    <main>
      <div className="containerm">
        <div id="qoh">Block-C</div>
        <div id="wysh">Select your Undergraduate Course</div>
      </div>
      <div className="badl">
        <div className="Containerfabc">
          <div className="containergbs1">
            <div className="gbsh1">SCHOOL OF ALLIED & HEALTH CARE SCIENCES</div>
            <div className="gbsc1">
              <ul>
                <Link to="#"><li className="fln">• B.Sc Medical Lab Sciences</li></Link>
                <Link to="#"><li className="fln">• Bachelors in Physiotherapy</li></Link>
                <Link to="#"><li className="fln">• B.Sc Nutrition & Dietetics</li></Link>
                <Link to="#"><li className="fln">• Bachelor of Optometry</li></Link>
                <Link to="#"><li className="fln">• B.sc. Operation Theatre & Anesthesia Technology</li></Link>
                <Link to="#"><li className="fln">• B.Sc. Medical Radiology & Imaging Technology</li></Link>
              </ul>
            </div>
          </div>
          <div className="containergbs2">
            <div className="gbsh2">GNA SCHOOL OF PHARMACY</div>
            <div className="gbsc2">
              <ul>
                <Link to="#"><li className="sln">• Bachelor of Pharmacy</li></Link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default BlockC;
