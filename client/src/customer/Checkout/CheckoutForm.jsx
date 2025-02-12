import React, { useEffect, useState } from 'react';
import "./Checkout.css"
import { AddressElement, useElements,PaymentElement } from '@stripe/react-stripe-js';
import { getClientPaymentMethod } from '../../apiManager/methods/paymentMethod';
import { ReactComponent as MasterCardLogo } from "../Components/Assets/mc_symbol.svg";  // If using ReactComponent export
import { ReactComponent as VisaLogo } from "../Components/Assets/Visa_2021.svg";  // Correct path and import statement
import { getUserAddress } from '../../apiManager/methods/addressMethods';


const AddressCard = ({addressData, bgColor}) => {

  return (
    <div className='checkout-address-card-container' style={{ backgroundColor: bgColor || "#F5F5F5" }} >
      <div className='bank-card-info'>
        {addressData?.addressName && (
          <h3>{addressData.addressName}</h3>
        )}
        
        <div className='address-info'>
          <p>{addressData.name}</p>
          <p>{addressData.line1}</p>
          <p>{addressData.line2}</p>
          <p>{addressData.city}, {addressData.postalCode}</p>
          <p>{addressData.state}</p>
          <p>{addressData.phone}</p>
        </div>
      </div>
    </div>
  )
}

const AddressForm = ({addressData, savedAddress, setSavedAddress, address, setAddress, toPayment}) => {
  const elements = useElements();
  const [selectAddress, setSelectAddress] = useState(false);

  useEffect(() => {
    if (!addressData || addressData.length <= 0){
      setSavedAddress(false)
      setAddress(null)
    } else {
      setSavedAddress(true)
      setAddress(addressData[0])
    }
  }, [addressData, setAddress, setSavedAddress])

  useEffect(() => {
    if (savedAddress){
      setAddress(addressData[0])
    }
  }, [addressData, savedAddress, setAddress])

  const handleSelectAddress = (address) => {

    setAddress(address)
    setSelectAddress(false)
  }

  const handleNextStep = async () => {

      const addressElement = elements?.getElement('address');
      if (!addressElement) {
          console.error('Address Element not found!');
          return;
      }

      const { complete, value } = await addressElement.getValue();

      if (complete) {
          
          try {
            const addressData = {
              name: value.name,   // Correctly include the name
              ...value.address,   // Spread the address object
              phone: value.phone, // Include the phone number
              // postalCode: value.address.postal_code
            };

            delete addressData.postal_code
            setAddress(addressData)
            toPayment()

          } catch (error) {
              console.log(error.message)
          }
      } else {
          console.error('Address form is incomplete.');
      }
  };

  return (
    <div>

      <div className='checkout-form-navbar'>
        <ul className='checkout-form-navbar-item'>
          {addressData && addressData.length > 0 ? (
            <li 
              className={`navbar-item ${savedAddress ? 'active' : ''}`}
              onClick={() => { setSavedAddress(true); }}
            >
              <p>Saved Address</p>
              {savedAddress ? <hr /> : null}
            </li>
          ) : null}

          <li 
            className={`navbar-item ${!savedAddress ? 'active' : ''}`}
            onClick={() => { setSavedAddress(false); }}
          >
            <p>New Address</p>
            {!savedAddress ? <hr /> : null}
          </li>
        </ul>
      </div>

      <div>
          { savedAddress ? (

          <div className='checkout-saved-address' >
            <div className='checkout-saved-address-selection-header'>
              <h3>Ship To</h3>

              {selectAddress ? (
                <i className="fa-solid fa-xmark fa-" onClick={() => setSelectAddress(false)}></i>
              ) : (
              <i className="fa-solid fa-pen-to-square fa-xl" onClick={() => setSelectAddress(true)}></i>
              )}
            </div>


            {selectAddress ? (
              <div className='checkout-saved-address-selection-container'>
                {addressData && addressData.length > 0 ? (
                  addressData.map((address, index) => (
                    <div  className='checkout-address-card-box' key={index} onClick={() => handleSelectAddress(address)}>
                      <AddressCard 
                        addressData={address}
                      />
                    </div>
                  ))
                ) : (
                  <p>No payment methods available.</p> // Show a message if no payment methods exist
                )}
              </div>
              ) : (
                <></>
            )}

            { address && !selectAddress ? (
              <div className='checkout-selected-card-info'>
              <AddressCard
                addressData={address}
                bgColor={"white"}
              />
          </div>
              
            ): (
              <></>
            )}            
          </div>

        ) : (
          <div className='address-component'>
            <AddressElement
              options={{
                  mode: 'shipping',
                  fields: {
                      phone: 'always', // Include the phone number field
                  },
              }}
            />

          </div>
        )}
      </div>

      <p className='checkout-form-shipping-btn' onClick={()=>{savedAddress ? toPayment(): handleNextStep()}}>Continue to Payment</p>
    </div>
  )
}

const CheckoutForm = ({address, setAddress}) => {

  // state varialbe to determince weather whcih window user is currently at (filling shipping address ot payment method)
  const [onAddress, setOnAddress] = useState(true)
  const [onPayment, setOnPayment] = useState(false)

  // link customer to the address section of the checkout form 
  const toAddress = () => {
    if (!onAddress && onPayment){
      setOnAddress(true);
      setOnPayment(false)
    }
  }

  // link customer to the payment section checkout form
  const toPayment = () => {
    if (onAddress && !onPayment){
      setOnAddress(false);
      setOnPayment(true)
    }
  }

  // fetch all the user address book information (if any)
  const [addressData, setAddressData] = useState([])
  useEffect(() => {
      const fetchUserAddres = async () => {
        try{
          const data = await getUserAddress();
          setAddressData(data)
        } catch (error) {
          console.log(error)
        }
      }
  
      fetchUserAddres()
    }, [])
  const [savedAddress, setSavedAddress] = useState(true)

  return (

    <div className='checkout-form'>

      {/* Checkout Form - Shipping Address Section */}
      <div className='checkout-form-section'>

        <div className="checkout-form-sectiob-header" >
          <h2>Shipping</h2>
          { address && !onAddress? (
            <i className="fa-solid fa-check fa-xl" ></i>
          ): (<></>)
          }
        </div>

        {
          onAddress ? (
            <AddressForm 
              addressData={addressData}
              savedAddress={savedAddress}
              setSavedAddress={setSavedAddress}
              address={address}
              setAddress={setAddress}
              toPayment={toPayment}
            />
          ) : 
          ( address ? (
            <div className='checkout-selected-address-container'>
              <h3>Ship To: </h3>
              <div className='checkout-selected-address-info'>
                <p>{address.name}</p>
                <p>{address.line1}</p>
                <p>{address.line2}</p>
                <p>{address.city}, {address.postalCode}</p>
                <p>{address.state}</p>
                <p>{address.phone}</p>
              </div>
              <p className='edit-btn' onClick={() => {toAddress()}}>Edit</p>
            </div>
          ): (
            <></>
          )
          )
        }
    </div>

      {/* Checkout Form - payment Section */}
      <div className='checkout-form-section'>

        <div className="checkout-form-sectiob-header">
          <h2>Payment</h2>   
        </div>

        {
          onPayment ? (
            <>
              <PaymentElement id="payment-element"/>
            </>
          ) : 
          ( 
            <></>
          )
        }

      </div>

    </div>
  );
};

export default CheckoutForm;
