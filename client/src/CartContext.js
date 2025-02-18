import React, { createContext, useState, useContext, useEffect } from 'react';
import { addCartProduct, deleteCartProduct, getUserCart, updateCartProduct } from './apiManager/methods/cartMethods';

// Create the context
const CartContext = createContext();

// Custom hook to use the CartContext in components
export const useCart = () => useContext(CartContext);

// CartProvider to wrap around the app and provide cart state
export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0)
  const [totalItem, setTotalItem] = useState(0)

  const fetchCart = async() => {
    try {
      const data = await getUserCart();
      console.log(data)
      setCartItems(data)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchCart();
  }, [])

  useEffect(() => {
    const calculateSubtotal = () => {
      if (cartItems && cartItems.length > 0){
        setSubtotal(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0))
      } else {
        setSubtotal(0)
      }
    };
  
    // Function to calculate total number of items in the cart
    const calculateTotalItems = () => {
      if (cartItems && cartItems.length>0){
        setTotalItem(cartItems.reduce((acc, item) => acc + item.quantity, 0));
      } else {
        setTotalItem(0)
      }
    };

    calculateSubtotal()
    calculateTotalItems()

  }, [cartItems])

  // Function to add an item to the cart
  const addItemToCart = async (productID, selectedVariant, selectedSize) => {
    
    try{
      await addCartProduct(productID, selectedVariant, selectedSize, 1);
      fetchCart()
    } catch (error) {
      console.log(error.message)
    }
  };

  // Function to remove an item from the cart
  const deleteCartItem = async(cartProductID) => {
    try {
      await deleteCartProduct(cartProductID);
      fetchCart()
    } catch (error) {
      console.log(error.message)
    }
  };

  // Function to update the quantity of an item in the cart
  const updateItemQuantity = async(cartProductID, quantity) => {

    try {
      await updateCartProduct(cartProductID, quantity);
      fetchCart()
    } catch (error) {
      console.log(error.message)
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      subtotal,
      totalItem,
      updateItemQuantity,
      deleteCartItem,
      addItemToCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
