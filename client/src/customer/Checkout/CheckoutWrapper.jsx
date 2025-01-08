import React,{ createContext, useEffect, useState } from "react";
import { checkoutCart } from "../../apiManager/methods/cartMethods";
import { createPaymentIntent } from "../../apiManager/methods/paymentMethod";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Outlet } from "react-router-dom";
import CheckoutHeader from "./CheckoutHeader";

const stripePromise = loadStripe('pk_test_51PnWiiGrBUkxkf9EfMve8DW3an5XYGU1KGENbAdVsfeJHDmVz7ARJmwOQ40uRe0qqkiak6MxzxXhC40hcnaKL9zG00CQSMphuS');

// Create a context to share data with child components
export const CheckoutContext = createContext();

const CheckoutWrapper = () => {
    const [userCart, setUserCart] = useState([]);
    const [clientSecret, setClientSecret] = useState("");
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0)
  
    useEffect(() => {
      const fetchCart = async () => {
        const data = await checkoutCart();
        setUserCart(data);
      };
      fetchCart();
    }, []);

    useEffect(() => {
      const cartTotal = userCart.reduce((accumulatedTotal, cartLine) => {
        return accumulatedTotal + (cartLine.price * cartLine.quantity);
      }, 0);

      setTotal(cartTotal ? cartTotal : 0)
    }, [userCart])

  
    useEffect(() => {
      const fetchClientSecret = async () => {
        try {
          console.log(total)
          const data = await createPaymentIntent(total);
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error("Error fetching client secret:", error);
          setMessage("An error occurred while processing your payment.");
        }finally {
          setIsLoading(false);
        }
      };

      if (total > 0){
      fetchClientSecret();
      }
      
    }, [total]);
  
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
        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
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

