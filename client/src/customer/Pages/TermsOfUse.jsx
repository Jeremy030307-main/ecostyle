import React from "react";
import "./TermsOfUse.css";

const TermsOfUse = () => {
  return (
    <div className="terms-of-use-container">
      <h1 className="terms-of-use-title">Terms of Use</h1>
      <p className="terms-of-use-intro">
        Welcome to EcoStyle! These Terms of Use outline the rules and
        regulations for the use of our website. By accessing this website, you
        agree to comply with and be bound by the following terms and conditions.
        Please read them carefully.
      </p>

      <div className="terms-section">
        <h2 className="terms-section-title">1. Acceptance of Terms</h2>
        <p>
          By accessing and using our website, you accept and agree to be bound
          by these Terms of Use and all applicable laws and regulations. If you
          do not agree to these terms, you are prohibited from using or
          accessing this site.
        </p>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">2. Use of the Website</h2>
        <ul className="terms-list">
          <li>You must be at least 18 years old to use this website.</li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account and password.
          </li>
          <li>
            You agree not to use this website for any unlawful or unauthorized
            purpose.
          </li>
          <li>
            We reserve the right to terminate your access to the website at any
            time without notice.
          </li>
        </ul>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">3. Intellectual Property</h2>
        <p>
          All content on this website, including text, graphics, logos, images,
          and software, is the property of EcoStyle or its content suppliers and
          is protected by copyright and trademark laws.
        </p>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">4. Limitations</h2>
        <p>
          EcoStyle is not responsible for any damages arising out of the use or
          inability to use the materials on our website. This includes, but is
          not limited to, loss of data or profit.
        </p>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">5. Modifications</h2>
        <p>
          EcoStyle reserves the right to revise these Terms of Use at any time
          without notice. By using this website, you agree to be bound by the
          current version of these Terms of Use.
        </p>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">6. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance
          with the laws of [Your Country/State], and you irrevocably submit to
          the exclusive jurisdiction of the courts in that location.
        </p>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">7. Contact Information</h2>
        <p>
          If you have any questions or concerns about these Terms of Use, please
          contact us at:
        </p>
        <p>Email: support@ecostyle.com</p>
        <p>Phone: +88015-88888-9999</p>
      </div>
    </div>
  );
};

export default TermsOfUse;
