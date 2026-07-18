import React from 'react';
import '../assets/css/pp.css';

function PrivacyPolicy() {
  return (
    <main>
      <div className="containerm">
        <div id="qoh">QuestionOra</div>
        <div id="wysh">Privacy policy</div>
      </div>
      <div className="containerpp">
        <div className="lfpp">
          <div className="pph">1. Information We Collect</div>
          <div>We may collect the following information when you use our site:</div>
          <div>Name and email address (if submitted through feedback or contact forms)</div>
          <div>User-submitted content such as question papers, suggestions, or comments</div>
          <div>We do not collect any personal data unless you choose to provide it.</div>
          <div className="pph">2. How We Use Your Data</div>
          <div>The data we collect is used only for:</div>
          <div>Improving the website and its features</div>
          <div>Responding to your feedback or queries</div>
          <div>Reviewing and managing uploaded resources (like papers)</div>
          <div>We do not sell, rent, or share your data with third parties.</div>
          <div className="pph">3. Data Security</div>
          <div>We take reasonable steps to protect your data from unauthorized access or misuse. However, no method of online storage is 100% secure, so we cannot guarantee absolute security.</div>
          <div className="pph">4. User-Submitted Content</div>
          <div>By submitting question papers or other material, you agree:</div>
          <div>That you have the right to share the material</div>
          <div>That it can be stored, reviewed, and published on the platform</div>
          <div>You can request removal at any time.</div>
          <div className="pph">5. Contact Us</div>
          <div>If you have any questions about this Privacy Policy or want your data removed, please contact us at:</div>
          <div>support@questionora.com</div>
          <div className="pph">6. Changes to This Policy</div>
          <div>We may update this Privacy Policy as needed. Any changes will be posted on this page with an updated effective date.</div>
          <div className="pph">Effective Date: [11.11.2011]</div>
        </div>
      </div>
    </main>
  );
}

export default PrivacyPolicy;
