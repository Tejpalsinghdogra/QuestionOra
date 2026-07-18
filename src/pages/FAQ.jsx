import React from 'react';
import '../assets/css/faq.css';

function FAQ() {
  return (
    <main>
      <div className="containerm">
        <div id="qoh">QuestionOra</div>
        <div id="wysh">FAQ/Help</div>
      </div>
      <div className="containerfaqh">
        <div className="containergq">
          <div className="gqh">General Information</div>
        </div>
        <div className="containergqd">
          <div className="gqc1 scroll-scale">
            <div className="gqch">Who runs QuestionOra?</div>
            <div className="gqcp">Question Ora is independently managed and maintained by a single individual. It is a solo initiative driven by a commitment to support students at GNA University by providing easy access to previous year question papers.</div>
          </div>
          <div className="gqc3 scroll-scale">
            <div className="gqch">Who can use QuestionOra?</div>
            <div className="gqcp">Question Ora is available to all students, faculty, and academic staff of GNA University. It is designed specifically to serve the GNA academic community and is open for everyone to benefit from.</div>
          </div>
          <div className="gqc2 scroll-scale">
            <div className="gqch">Will QuestionOra improve in future?</div>
            <div className="gqcp">Yes, continuous improvements are planned for both functionality and user experience. Future updates may include enhanced filters, mobile optimization, better categorization, and the ability for users to upload their own papers.</div>
          </div>
        </div>
        <div className="containerut">
          <div className="utp">Using the Platform</div>
        </div>
        <div className="containerutp">
          <div className="utp1 scroll-scale">
            <div className="utph">How can I find past question papers?</div>
            <div className="utpp">Question papers are systematically organized by university block for easy access. Users can navigate by selecting the appropriate block, then filter results by course name, semester, and subject to locate specific papers.</div>
          </div>
          <div className="utp2 scroll-scale">
            <div className="utph" id="utpd">Can I preview papers before downloading?</div>
            <div className="utpp" id="utppd">Currently, the platform does not offer a preview feature. To view the content of any paper, you will need to download the file first and open it on your device using a PDF reader.</div>
          </div>
          <div className="utp3 scroll-scale">
            <div className="utph" id="utpf">What format are the papers provided in?</div>
            <div className="utpp" id="utppf">All question papers are uploaded in standard PDF format. This ensures broad compatibility and ease of use across various devices including smartphones, tablets, and desktop computers.</div>
          </div>
        </div>
        <div className="containeraa">
          <div className="aaa">Account & Access</div>
        </div>
        <div className="containeraaa">
          <div className="aaa1 scroll-scale">
            <div className="aaah">Do I need an account to use QuestionOra?</div>
            <div className="aaap">Browsing is available without an account, but downloading requires registration. Creating an account also enables access to upcoming personalized features and helps us ensure responsible usage of resources.</div>
          </div>
          <div className="aaa3 scroll-scale">
            <div className="aaah" id="aaaf">What should I do if I forget my password?</div>
            <div className="aaap" id="aaapf">If you forget your password, contact us via email using your registered address. Once your identity is verified, we will securely share the password reset instructions with you.</div>
          </div>
          <div className="aaa2 scroll-scale">
            <div className="aaah" id="aaad">How do I create an account?</div>
            <div className="aaap" id="aaapd">To register, simply fill out the sign-up form on the homepage. Provide your full name, email address, and a password (with confirmation). Your account will be created immediately upon submission.</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default FAQ;
