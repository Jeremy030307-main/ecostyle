import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1 className="privacy-policy-title">Privacy Policy</h1>
      <p className="privacy-policy-intro">
        At EcoStyle, your privacy is of utmost importance to us. This Privacy Policy outlines the types of information we collect, how we use it, and the steps we take to protect it.
      </p>

      <section className="privacy-section">
        <h2 className="privacy-section-title">1. Information We Collect</h2>
        <p>
          We collect the following types of information to provide and improve our services:
        </p>
        <ul className="privacy-list">
          <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping address when you register, place an order, or contact us.</li>
          <li><strong>Payment Information:</strong> Billing address, payment card details, or other payment information necessary to complete transactions.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, operating system, and other technical data collected through cookies and analytics tools.</li>
          <li><strong>Usage Data:</strong> Information about your activity on our website, such as pages viewed, time spent, and clicks.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section-title">2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="privacy-list">
          <li>Process and fulfill orders, including sending order confirmations and updates.</li>
          <li>Provide customer support and respond to inquiries.</li>
          <li>Send promotional emails, offers, and newsletters (only if you opt-in).</li>
          <li>Analyze website usage to improve our services and user experience.</li>
          <li>Comply with legal obligations and enforce our terms of service.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section-title">3. Sharing Your Information</h2>
        <p>We do not sell or rent your personal information. However, we may share your information in the following scenarios:</p>
        <ul className="privacy-list">
          <li><strong>Service Providers:</strong> We may share data with third-party service providers, such as payment processors and delivery partners, to fulfill your orders.</li>
          <li><strong>Legal Obligations:</strong> We may disclose your information to comply with legal or regulatory requirements.</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section-title">4. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your browsing experience. These cookies help us:
        </p>
        <ul className="privacy-list">
          <li>Remember your preferences and login details.</li>
          <li>Analyze website traffic and usage patterns.</li>
          <li>Serve personalized advertisements based on your browsing behavior.</li>
        </ul>
        <p>
          You can manage your cookie preferences through your browser settings.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section-title">5. Data Security</h2>
        <p>
          We take reasonable measures to protect your data from unauthorized access, alteration, or destruction. These measures include encryption, firewalls, and secure data storage.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section-title">6. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at <a href="mailto:privacy@ecostyle.com">privacy@ecostyle.com</a>.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section-title">7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page, and significant updates will be communicated via email.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section-title">8. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, please contact us at:
        </p>
        <p>Email: <a href="mailto:support@ecostyle.com">support@ecostyle.com</a></p>
        <p>Phone: +88015-88888-9999</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
