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

const BankCard = ({ bankData, bgColor }) => {
  return (
    <div
      className="bank-card-container"
      style={{ backgroundColor: bgColor || "#F5F5F5" }} // Default to white if no bgColor is provided
    >
      <div className="bank-card-info">
        {/* Conditional rendering for the logo */}
        {bankData.brand === 'visa' ? (
          <VisaLogo className="bank-brand-logo" />
        ) : bankData.brand === 'mastercard' ? (
          <MasterCardLogo className="bank-brand-logo" />
        ) : (
          <div className="bank-brand-logo">Unknown Brand</div> // Fallback for unknown brands
        )}
        <p>**** **** **** {bankData.last4}</p>
        <p>{bankData.exp_month}/{bankData.exp_year}</p>
      </div>
    </div>
  );
};

const AddressForm = ({addressData, savedAddress, setSavedAddress, address, setAddress, toPayment}) => {
  const elements = useElements();
  const [selectAddress, setSelectAddress] = useState(false);

  useEffect(() => {
    if (!addressData || addressData.length <= 0){
      console.log(1)
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
      console.log("ffdfd")

      const addressElement = elements?.getElement('address');
      if (!addressElement) {
          console.error('Address Element not found!');
          return;
      }

      const { complete, value } = await addressElement.getValue();

      if (complete) {

          console.log('Address:', value.address);
          console.log('Phone:', value);
          
          try {
            const addressData = {
              name: value.name,   // Correctly include the name
              ...value.address,   // Spread the address object
              phone: value.phone, // Include the phone number
              // postalCode: value.address.postal_code
            };

            delete addressData.postal_code
            setAddress(addressData)
            console.log("hahaha")
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
          <li onClick={() => { setSavedAddress(true); }}>
            <p>Saved Address</p>
            {savedAddress ? <hr/>: <></>}
          </li>
        ):(
          <></>
        )}
          <li onClick={() => { setSavedAddress(false); setAddress(null); }}> 
            <p>New Address</p>
            {!savedAddress ? <hr/>: <></>}
          </li>
        </ul>
        <hr />
      </div>

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
          <p className='checkout-form-shipping-btn' onClick={()=>toPayment()}>To Payment</p>
          
        </div>

      ) : (
        <>
          <AddressElement
            options={{
                mode: 'shipping',
                fields: {
                    phone: 'always', // Include the phone number field
                },
            }}
          />

          <p className='checkout-form-shipping-btn' onClick={() => handleNextStep()}>Continue to Shipping Option</p>
        </>
        
      )}
    </div>
  )
}

const CardForm = ({cardsData, savedCard, setSavedCard, card, setCard}) => {

  const [selectCard, setSelectCard] = useState(false)

  useEffect(() => {
    if (!cardsData || cardsData.length <= 0){
      setSelectCard(false)
      setSavedCard(false)
    } else {
      setCard(cardsData[0])
    }
  }, [cardsData, setSelectCard, setCard, setSavedCard])

  const handleCardSelection = (card) => {
    setCard(card)
    setSelectCard(false)
  }

  useEffect(() => {
    if (savedCard){
      setCard(cardsData[0])
    }
  }, [cardsData, savedCard, setCard])

  const paymentElementOptions = {
    layout: "accordion"
  }

  return (
    <div>

      {/* Header Navbar */}
      <div className='checkout-form-navbar'>
        <ul className='checkout-form-navbar-item'>
          {cardsData && cardsData.length > 0 ? (
            <li onClick={() => { setSavedCard(true); }}>
              <p>Saved Card</p>
              {savedCard ? <hr/>: <></>}
            </li>
          ):(
            <></>
          )}
          <li onClick={() => { setSavedCard(false); setCard(null) }}> 
            <p>New Card</p>
            {!savedCard ? <hr/>: <></>}
          </li>
        </ul>
        <hr />
      </div>

      { savedCard ? (

        <form className='checkout-saved-address'>
          <div className='checkout-saved-address-selection-header'>
            <h3>Card Used</h3>

            {selectCard ? (
              <i className="fa-solid fa-xmark fa-" onClick={() => setSelectCard(false)}></i>
            ) : (
             <i className="fa-solid fa-pen-to-square fa-xl" onClick={() => setSelectCard(true)}></i>
            )}
          </div>

          {selectCard ? (
            <div className='checkout-saved-address-selection-container'>
               {cardsData && cardsData.length > 0 ? (
                 cardsData.map((card) => (
                  <div key={card.id} onClick={() => {handleCardSelection(card)}}>
                    <BankCard
                    bankData={card}
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

          { card && !selectCard ? (
            <div className='checkout-selected-card-info'>
                <BankCard
                  bankData={card}
                  bgColor={"white"}
                />
            </div>
          ): (
            <></>
          )}

          {/* <button type="submit">Continue To Payment</button> */}
        </form>

      ) : (
        <PaymentElement id="payment-element" options={paymentElementOptions} />
      )}
    </div>
  )
}

const CheckoutForm = ({address, setAddress, card, setCard}) => {

  // state varialbe to determince weather whcih window user is currently at (filling shipping address ot payment method)
  const [onAddress, setOnAddress] = useState(true)
  const [onPayment, setOnPayment] = useState(false)
  const toAddress = () => {
    if (!onAddress && onPayment){
      setOnAddress(true);
      setOnPayment(false)
    }
  }
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

  // fetch all the user saved card payment method
  const [cardsData, setCardsData] = useState([])
  useEffect(() => {
    const fetchPaymentMethod = async() => {
    
      try {
        const paymentMethods = await getClientPaymentMethod()
        console.log(paymentMethods.paymentMethods)
        setCardsData(paymentMethods.paymentMethods)
      } catch (error) {
        console.log(error)
      }
    }

    fetchPaymentMethod();
  }, [])
  const [savedCard, setSavedCard] = useState(true)

  return (

    <div className='checkout-form'>

      <div className='checkout-form-section' onClick={()=> {toAddress()}}>

        <div className="checkout-form-sectiob-header" >
          <h2>Shipping</h2>

          { address && !onAddress? (
            <i className="fa-solid fa-check fa-2xl" ></i>
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
            </div>
          ): (
            <></>
          )
          )
        }
      </div>

      <div className='checkout-form-section'   >
        <div className="checkout-form-sectiob-header" onClick={()=> {toPayment()}}>
          <h2>Payment</h2>

          { card && !onPayment? (
            <i className="fa-solid fa-check fa-2xl" ></i>
          ): (<></>)
          }
          
        </div>

        {
          onPayment ? (
            <CardForm
              cardsData={cardsData}
              setSavedCard={setSavedCard}
              savedCard={savedCard}
              card={card}
              setCard={setCard}
            />
          ) : 
          ( card ? (
            <div className='checkout-selected-address-container'>
              {/* <h3>Ship To: </h3>
              <div className='checkout-selected-address-info'>
                <p>{address.name}</p>
                <p>{address.line1}</p>
                <p>{address.line2}</p>
                <p>{address.city}, {address.postalCode}</p>
                <p>{address.state}</p>
                <p>{address.phone}</p>
            </div> */}
            </div>
          ): (
            <></>
          )
        )
        }

      </div>
    </div>
  );
};

export default CheckoutForm;
