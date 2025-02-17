import React, { useContext, useEffect, useState } from 'react';
import "./Checkout.css"
import { AddressElement, useElements,PaymentElement } from '@stripe/react-stripe-js';
import { CheckoutContext } from './CheckoutWrapper';
import { updatePaymentIntent } from '../../apiManager/methods/paymentMethod';


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

const AddressForm = ({toAddress, toPayment, onAddress}) => {

  const elements = useElements();
  const {total, subtotal, address, setAddress, addressData, shippingFeeOptions, shippingMode, setShippingMode, paymentIntentID} = useContext(CheckoutContext)
  
  const [savedAddress, setSavedAddress] = useState(true)
  const [selectAddress, setSelectAddress] = useState(false);
  const [onShippingMode, setOnShippingMode] = useState(false)

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

  const [shippingID, setShippingID] = useState(null)
  useEffect(() => {
    setShippingID(shippingMode.id)

  }, [shippingMode])

  const handleSelectShipping = (shippingMode) => {
    setShippingMode(shippingMode)
    setShippingID(shippingMode.id)
  }

  const handleSelectAddress = (address) => {
    setAddress(address)
    setSelectAddress(false)
  }

  const handleNextStep = async () => {

    if (onShippingMode){
      toPayment()
      updatePaymentIntent(total, subtotal, shippingMode.price, paymentIntentID, address)

    } else {
      if (savedAddress) {
        // toPayment()
        setOnShippingMode(true)
  
      } else {
  
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
                postalCode: value.address.postal_code
              };
  
              delete addressData.postal_code
              setAddress(addressData)
              // toPayment()
              setOnShippingMode(true)
  
            } catch (error) {
                console.log(error.message)
            }
        } else {
            console.error('Address form is incomplete.');
        }
      }

    }
  };

  return (
    <div>

      { onAddress && !onShippingMode && (

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
        </div>
      )}

      { onShippingMode && address && (
          <div className='checkout-selected-address-container'>
            <h3 className='checkout-selected-box' >Ship Address: </h3>
            <div className='checkout-selected-address-info'>
              <p>{address.name}</p>
              <p>{address.line1}</p>
              <p>{address.line2}</p>
              <p>{address.city}, {address.postalCode}</p>
              <p>{address.state}</p>
              <p>{address.phone}</p>
            </div>
            <p className='edit-btn' onClick={() => {setOnShippingMode(false); toAddress()}}>Edit</p>
          </div>
      )}

      { onAddress && onShippingMode &&  (
        <div className="shipping-mode-container">
          <h3 className="shipping-mode-title">Select a Shipping Option:</h3>
          <ul className="shipping-mode-list">
            {shippingFeeOptions.map((option) => (
              <li
                key={option.id}
                className={`shipping-mode-list-item ${shippingID === option.id ? "shipping-mode-selected" : ""}`}
                onClick={() => handleSelectShipping(option)}
              >
                <div>
                  <h4>{option.name}</h4>
                  <p>RM{option.price} - {option.description}</p>
                </div>
              </li>
            ))}
          </ul>
      </div>
      )}

      { shippingMode && !onAddress && (
        <div className='checkout-selected-address-container'>
        <h3 className='checkout-selected-box'>Shipping Mode: </h3>
        <div className='checkout-selected-address-info'>
          <p>{shippingMode.name}</p>
          <p>{shippingMode.description}</p>
        </div>
        <p className='edit-btn' onClick={() => {setOnShippingMode(true); toAddress()}}>Edit</p>
      </div>
      )}

    { onAddress && (
      <p className='checkout-form-shipping-btn' onClick={handleNextStep}>{ onShippingMode ? ("Continue to Payment"):("Continue to Shipping Option")}</p>
    )}
    </div>
  )
}

const CheckoutForm = () => {

  const {address} = useContext(CheckoutContext)

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

        <AddressForm 
          toAddress={toAddress}
          toPayment={toPayment}
          onAddress={onAddress}
        />
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
