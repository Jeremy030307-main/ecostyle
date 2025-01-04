import React, { useEffect, useState } from 'react';
import { ReactComponent as MasterCardLogo } from "../Components/Assets/mc_symbol.svg";  // If using ReactComponent export
import { ReactComponent as VisaLogo } from "../Components/Assets/Visa_2021.svg";  // Correct path and import statement
import "./Account.css"
import { Link, useNavigate } from 'react-router-dom';
import { deleteAddress, editAddress, useUserAddress } from '../../apiManager/methods/addressMethods';

const AddressCard = ({addressData, onEdit, onDelete}) => {

  console.log(addressData)
  return (
    <div className='address-card-container'>
          <div className='bank-card-info'>
            <h2>{addressData.addressName}</h2>
            <div className='address-info'>
              <p>{addressData.name}</p>
              <p>{addressData.line1}</p>
              <p>{addressData.line2}</p>
              <p>{addressData.city}, {addressData.postalCode}</p>
              <p>{addressData.state}</p>
              <p>{addressData.phone}</p>
            </div>
          </div>
    
          <div className='address-card-btn'>
            <button className='address-delete-btn' onClick={() => onDelete(addressData.addressName)}>Delete</button>
            <button className='address-edit-btn' onClick={() => onEdit(addressData)}>Edit</button>
          </div>
        </div>
  )
}

const AccountAddressbook = () => {

  const addressData = useUserAddress();
  const navigate = useNavigate();

  const handleDelete = async (addressName) => {
    try {
      await deleteAddress(addressName);
      console.log("success")

    } catch (error ){
      console.log(error.message)
    }
  }

  const handleEdit = async (address) => {
    navigate('address-management/edit', {state: {address}})
  }
  
  return (
    <div className='payment-option-container'>
    
        <div className='payment-option-header'>
            < h1>Address Book</h1>
            
            {/* Button to navigate to the AddPaymentMethod page */}
            <Link to="address-management/add"><button>Add New Address</button> </Link>
        </div>

        <div className='bank-card-wrapper'>
          {addressData && addressData.length > 0 ? (
            addressData.map((address, index) => (
              <AddressCard 
                key={index}
                addressData={address}
                onDelete={handleDelete}
                onEdit={handleEdit}
              /> 
            ))
          ) : (
            <p>No payment methods available.</p> // Show a message if no payment methods exist
          )}
        </div>
    </div>
  );
};

export default AccountAddressbook;

