import React,{ createContext, useEffect, useState } from "react";
import { checkoutCart } from "../../apiManager/methods/cartMethods";
import { createPaymentIntent, updatePaymentIntent } from "../../apiManager/methods/paymentMethod";
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
    const [subtotal, setSubtotal] = useState(0)
    const [shippingFeeOptions, setShippingFeeOptions] = useState([])

    const [clientSecret, setClientSecret] = useState(null);
    const [customerSessionClientSecret, setCustomerSessionClientSecret] = useState(null);
    const [paymentIntentID, setPaymentIntentID] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    const [address, setAddress] = useState(null);
    const [shippingMode, setShippingMode] = useState(null)
  
    // fetch the user shopping cart
    useEffect(() => {
      const fetchCart = async () => {
        const data = await checkoutCart();
        setUserCart(data.cartData);
        setShippingFeeOptions(data.shippingFeeData)
        setShippingMode(data.shippingFeeData[0])
      };
      fetchCart();
    }, []);

    // calculate the total of the customer user cart
    useEffect(() => {
      const cartTotal = userCart.reduce((accumulatedTotal, cartLine) => {
        return accumulatedTotal + (cartLine.price * cartLine.quantity);
      }, 0);

      setSubtotal(cartTotal ? cartTotal : 0)
    }, [userCart])

    const [total, setTotal] = useState(0)
    useEffect(() => {
      if (shippingMode){
        setTotal(shippingMode.price + subtotal)
      }
    }, [shippingMode, subtotal])
  
    // Create PaymentIntent (only when needed)
    useEffect(() => {
      const fetchClientSecret = async () => {
        if (clientSecret || total <= 0) return; // Prevent unnecessary calls
        try {
          const data = await createPaymentIntent(total, subtotal, shippingMode.price);
          setClientSecret(prev => prev ?? data.client_secret);
          setCustomerSessionClientSecret(prev => prev ?? data.customer_session_client_secret);
          setPaymentIntentID(prev => prev ?? data.paymentIntentID);
        } catch (error) {
          console.error("Error fetching client secret:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchClientSecret();
    }, [clientSecret, total]);

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
          <CheckoutContext.Provider value={{ userCart, total, subtotal, clientSecret, address, setAddress, addressData, shippingFeeOptions, shippingMode, setShippingMode, paymentIntentID }}>
            <Outlet />
          </CheckoutContext.Provider>
        </Elements>
      ) : (
        <div>Loading payment gateway...</div>
      )}
      </div>
    );
    
  };
  
export default CheckoutWrapper;

