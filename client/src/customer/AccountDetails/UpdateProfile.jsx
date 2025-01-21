import React, { useEffect, useState } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../../apiManager/methods/userMethods";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'


const UpdateProfile = () => {
    const [email, setEmail] = useState("user@example.com"); // Replace with actual user email
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState(""); // Error state for phone validation
    const [isPhoneValid, setIsPhoneValid] = useState(true); // State to check if phone number is valid

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
        const data = await getUser();
        setEmail(data.email);
        setName(data.displayName)
        setPhone(data.phone)
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {

        if (!phone || phone === ""){
            // phone = null
        } else {
            console.log(isValidPhoneNumber(phone))
            if (!isValidPhoneNumber(phone)){
                setPhoneError("Invalid phone number format. Please check and try again.");
                return;
            }
        }

        console.log("Saved Data:", { name, phone });

        try {
        await updateUser(name, phone);
        navigate("../"); // Navigate back after successful save
        } catch  (error) {
        console.error(error.message);
        }
    };

    const handleCancel = () => {
        setName("");
        setPhone("");
        setPhoneError(""); // Reset error state
        navigate("../");
    };

  // Phone validation function
  const handlePhoneChange = (value) => {
    setPhone(value);

    if (value && !isValidPhoneNumber(value)) {
      setPhoneError("Invalid phone number format. Please check and try again.");
      setIsPhoneValid(false); // Set phone as invalid
    } else {
      setPhoneError(""); // Clear error message if valid
      setIsPhoneValid(true); // Set phone as valid
    }
  };

  return (
    <div className="payment-option-container">
      <div className="payment-option-header">
        <h1>Update Profile</h1>
      </div>

      <div className="account-personal-detail">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="profile-update-form"
        >
          {/* Email Field */}
          <div className="profile-update-field">
            <label htmlFor="email" className="profile-update-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="profile-update-input profile-update-email"
            />
          </div>

          {/* Name Field */}
          <div className="profile-update-field">
            <label htmlFor="name" className="profile-update-label">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="profile-update-input"
            />
          </div>

          {/* Phone Field */}
          <div className="profile-update-field">
            <label htmlFor="phone" className="profile-update-label">Phone</label>
            <PhoneInput
              placeholder="Enter phone number"
              value={phone}
              onChange={handlePhoneChange} // Update phone on change
              defaultCountry="MY"
            />
            {phoneError && <p className="profile-update-error">{phoneError}</p>}
          </div>

          {/* Buttons */}
          <div className="profile-update-actions">
            <button type="submit" className="profile-update-btn profile-update-save">
              Save
            </button>
            <button
              type="button"
              className="profile-update-btn profile-update-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
