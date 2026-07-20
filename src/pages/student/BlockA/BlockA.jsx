import { Link } from 'react-router-dom';
import './blocka.css';

function BlockA() {
  return (
    <main>
      <div className="containerm">
        <div id="qoh">Block-A</div>
        <div id="wysh">Select your Undergraduate Course</div>
      </div>
      <div className="badl">
        <div className="Containerfabc">
          <div className="containergbs1">
            <div className="gbsh1">GNA BUSINESS SCHOOL</div>
            <div className="gbsc1">
              <ul>
                <Link to="#"><li className="fln">• Bachelor of Commerce in Data Science</li></Link>
                <Link to="#"><li className="fln">• BBA In Digital Marketing</li></Link>
                <Link to="#"><li className="fln">• Bachelor of Business Administration</li></Link>
                <Link to="#"><li className="fln">• Bachelor of Commerce</li></Link>
              </ul>
            </div>
          </div>
          <div className="containergbs5">
            <div className="gbsh5">SCHOOL OF NATURAL SCIENCES</div>
            <div className="gbsc5">
              <ul>
                <Link to="#"><li className="filn">• B.Sc. Physics</li></Link>
                <Link to="#"><li className="filn">• B.Sc. Chemistry</li></Link>
                <Link to="#"><li className="filn">• B.Sc. Mathematics</li></Link>
                <Link to="#"><li className="filn">• B.Sc Physical Sciences</li></Link>
              </ul>
            </div>
          </div>
          <div className="containergbs2">
            <div className="gbsh2">SCHOOL OF HOSPITALITY</div>
            <div className="gbsc2">
              <ul>
                <Link to="#"><li className="sln">• Bachelor of Hotel Management & Catering Technology</li></Link>
                <Link to="#"><li className="sln">• B.Sc Hotel Management</li></Link>
                <Link to="#"><li className="sln">• B.Sc Airlines Tourism & Hospitality</li></Link>
              </ul>
            </div>
          </div>
          <div className="containergbs3">
            <div className="gbsh3">SCHOOL OF DESIGN & MASS COMMUNICATION</div>
            <div className="gbsc3">
              <ul>
                <Link to="/course/clayout6"><li className="tln">• B.Sc Animation & Multimedia</li></Link>
                <Link to="#"><li className="tln">• BA (Journalism & Mass Communication)</li></Link>
                <Link to="#"><li className="tln">• Bachelor of Design</li></Link>
              </ul>
            </div>
          </div>
          <div className="containergbs4">
            <div className="gbsh4">SCHOOL OF PHYSICAL EDUCATION AND SPORTS</div>
            <div className="gbsc4">
              <ul>
                <Link to="#"><li className="foln">• Bachelor of Physical Education & Sports</li></Link>
              </ul>
            </div>
          </div>
          <div className="containergbs6">
            <div className="gbsh6">SCHOOL OF LIBERAL ARTS</div>
            <div className="gbsc6">
              <ul>
                <Link to="#"><li className="siln">• Bachelors of Arts</li></Link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default BlockA;
