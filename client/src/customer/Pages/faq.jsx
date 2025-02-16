import React from "react";
import "./faq.css";

const FAQ = () => {
  const faqs = [
    {
      category: "Account & Login",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click on the 'Sign Up' button at the top-right corner and fill in your details to register an account.",
        },
        {
          question: "I forgot my password. How can I reset it?",
          answer: "Click on 'Forgot Password' on the login page, enter your registered email, and follow the instructions sent to your inbox.",
        },
        {
          question: "Can I update my profile information?",
          answer: "Yes, go to your account settings and update your profile details such as name, email, or password.",
        },
      ],
    },
    {
      category: "Orders & Payments",
      questions: [
        {
          question: "How do I track my order?",
          answer: "Go to your account, click on 'My Orders,' and select the order you want to track. The tracking details will be displayed.",
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept credit/debit cards, PayPal, and EcoPoints for eligible purchases.",
        },
        {
          question: "Can I cancel or modify my order?",
          answer: "You can cancel or modify your order within 1 hour of placing it. Go to 'My Orders' in your account to request changes.",
        },
      ],
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          question: "What are the delivery charges?",
          answer: "Delivery charges vary based on your location and the total order value. Free shipping is available for orders over $140.",
        },
        {
          question: "How long does delivery take?",
          answer: "Standard delivery takes 3–5 business days, while express delivery takes 1–2 business days.",
        },
        {
          question: "Can I change my delivery address after placing an order?",
          answer: "Yes, but you must update the address before the order is shipped. Contact customer support to request changes.",
        },
      ],
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for unused items in their original packaging. Return shipping fees may apply.",
        },
        {
          question: "How do I request a refund?",
          answer: "Submit a refund request through 'My Orders' in your account. Refunds are processed within 5–7 business days after approval.",
        },
        {
          question: "What items are non-refundable?",
          answer: "Customized products, perishable goods, and items marked 'Final Sale' are not eligible for returns or refunds.",
        },
      ],
    },
    {
      category: "Customer Support",
      questions: [
        {
          question: "How can I contact customer support?",
          answer: "You can reach us 24/7 through the 'Contact Us' page, email us at support@example.com, or call +88015-88888-9999.",
        },
        {
          question: "What languages does your customer support team speak?",
          answer: "Our team is fluent in English and Malaysian to assist you better.",
        },
        {
          question: "Do you offer live chat support?",
          answer: "Yes, live chat is available during business hours. Look for the chat icon on the bottom-right corner of the website.",
        },
      ],
    },
  ];

  return (
    <div className="faq-container">
      <h1 className="faq-title">Frequently Asked Questions (FAQ)</h1>
      {faqs.map((faqCategory, index) => (
        <div key={index} className="faq-category">
          <h2 className="faq-category-title">{faqCategory.category}</h2>
          {faqCategory.questions.map((faq, i) => (
            <div key={i} className="faq-item">
              <h3 className="faq-question">{faq.question}</h3>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
