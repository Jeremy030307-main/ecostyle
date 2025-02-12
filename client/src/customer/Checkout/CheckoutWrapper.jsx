import React,{ createContext, useEffect, useState } from "react";
import { checkoutCart } from "../../apiManager/methods/cartMethods";
import { createPaymentIntent } from "../../apiManager/methods/paymentMethod";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Outlet } from "react-router-dom";
import CheckoutHeader from "./CheckoutHeader";
import { getUserAddress } from "../../apiManager/methods/addressMethods";

const stripePromise = loadStripe('pk_test_51PnWiiGrBUkxkf9EfMve8DW3an5XYGU1KGENbAdVsfeJHDmVz7ARJmwOQ40uRe0qqkiak6MxzxXhC40hcnaKL9zG00CQSMphuS');

// Create a context to share data with child components
export const CheckoutContext = createContext();

const CheckoutWrapper = () => {
    const [userCart, setUserCart] = useState([]);
    const [total, setTotal] = useState(0)
    const [address, setAddress] = useState(null);

    const [clientSecret, setClientSecret] = useState("");
    const [customerSessionClientSecret, setCustomerSessionClientSecret] = useState("");
    const [isLoading, setIsLoading] = useState(true);
  
    // fetch the user shopping cart
    useEffect(() => {
      const fetchCart = async () => {
        const data = await checkoutCart();
        setUserCart(data);
      };
      fetchCart();
    }, []);

    // calculate the total of the customer user cart
    useEffect(() => {
      const cartTotal = userCart.reduce((accumulatedTotal, cartLine) => {
        return accumulatedTotal + (cartLine.price * cartLine.quantity);
      }, 0);

      setTotal(cartTotal ? cartTotal : 0)
    }, [userCart])
  
    // create the payment intent from stripe 
    useEffect(() => {
      const fetchClientSecret = async () => {
        try {
          console.log(total)
          const data = await createPaymentIntent(total);
          console.log(data)
          setClientSecret(data.client_secret);
          setCustomerSessionClientSecret(data.customer_session_client_secret)
        } catch (error) {
          console.error("Error fetching client secret:", error);
        }finally {
          setIsLoading(false);
        }
      };

      if (total > 0){
      fetchClientSecret();
      }
      
    }, [total]);

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
  
    const appearance = {
      theme: 'stripe',
    };

    if (isLoading) {
      return <div>Loading...</div>; // Show a loading spinner or skeleton
    }
  
    if (!clientSecret) {
      return <div>Error: Unable to create payment intent</div>;
    }
  
    return (
      <div>
      {clientSecret ? (
        <Elements options={{ clientSecret,customerSessionClientSecret, appearance }} stripe={stripePromise}>
          <CheckoutContext.Provider value={{ userCart, total, clientSecret }}>
            <div className="checkout-container">
              <div id="payment-form">
                <CheckoutHeader />
                <div className="checkout-body">
                  <Outlet /> 
                </div>
              </div>
            </div>
          </CheckoutContext.Provider>
        </Elements>
      ) : (
        <div>Loading payment gateway...</div>
      )}
      </div>
    );
    
  };
  
export default CheckoutWrapper;

