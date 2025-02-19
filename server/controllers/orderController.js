import admin from 'firebase-admin';
import { db } from "../firebase.js";
import { getPaymentIntentObject, getPaymentMethodObject } from "./paymentController.js";
import { COLLECTIONS, message } from "./utility.js"; 
import {placedOrder} from "./stockController.js"

const ORDER_STATUS = {
  ORDER_PLACED: "Order Placed",
  ORDER_PAID: "Order Paid",
  ORDER_SHIPPPED_OUT: "Order Ship Out",
  ORDER_RECEIVED: "Order Received",
  ORDER_COMPLETED: "Order Completed"
}

export const createOrder = async (req, res) => {

    const uid = req.user
    const { cartsData,paymentIntentID } = req.body;

    // Remove the `id` field from each cart item
    const products = cartsData.map((product) => {
      // Destructure the product object, excluding the `id` field
      const { id, ...restOfProduct } = product;
      return restOfProduct; // Return the product without the `id` field
    });

    const orderData = {
      customerID: uid,
      products, // Array of product objects with details
      order_status: ORDER_STATUS.ORDER_PLACED,
      order_placed: admin.firestore.Timestamp.now()
    }

    try {
      const paymentIntent = await getPaymentIntentObject(paymentIntentID);

      orderData.roundedTotal = paymentIntent.amount / 100
      orderData.subtotal = paymentIntent.metadata.subtotal
      orderData.shippingFee = paymentIntent.metadata.shippingFee
      orderData.shippingAddress = paymentIntent.shipping

      // Start Firestore transaction
      const writeOrderInTransaction = async () => {

        try {
          // Start a Firestore transaction
          await db.runTransaction(async (transaction) => {

            const orderRef = db.collection(COLLECTIONS.ORDER).doc(paymentIntentID); // Generate a new document reference for the order
            const userCartRef = db.collection(COLLECTIONS.USER).doc(uid).collection(COLLECTIONS.CART);

            const cartSnapshot = await transaction.get(userCartRef);
            // Add the order data to the 'orders' collection
            for (const product of products) {
                await placedOrder(transaction, product.product, product.size, product.variant, product.quantity);
            }

            transaction.set(orderRef, orderData);
            cartSnapshot.docs.forEach(doc => {
              transaction.delete(doc.ref);
            });

            // You can add more actions here if necessary (e.g., updating user data, adding payment logs, etc.)

            // The transaction will automatically commit at the end of this block
          });

          console.log('Order created and inventory updated successfully!');
          return { message: 'Order created successfully' };

      } catch (error) {
          console.error('Error creating order in transaction: ', error);
          return message(error.message);
      }
      };

      // Run the function
      writeOrderInTransaction().then(response => {
          res.status(200).send(response);
      }).catch(error => {
          res.status(500).send(error);
      });

    } catch (error) {
      console.log(error.message)
    }
};

export const paidOrder = async (req, res) => {

  console.log("hahaahahah")

  const { paymentIntentID } = req.body;

  const orderData = {
    order_status: ORDER_STATUS.ORDER_PAID,
    order_paid: admin.firestore.Timestamp.now()
  }

  // Start Firestore transaction
  const writeOrderInTransaction = async () => {

      try {

          // Start a Firestore transaction
          await db.runTransaction(async (transaction) => {
              const orderRef = db.collection(COLLECTIONS.ORDER).doc(paymentIntentID); // Generate a new document reference for the order
              transaction.set(orderRef, orderData, {merge: true});
          });

          const ordersnapshot =  await db.collection(COLLECTIONS.ORDER).doc(paymentIntentID).get()

          return { order: ordersnapshot.data() };

      } catch (error) {
          console.error('Error creating order in transaction: ', error);
          return { message: 'Failed to create order', error };
      }
  };

  try {
    const paymentIntent = await getPaymentIntentObject(paymentIntentID);
    const paymentMethod = await getPaymentMethodObject(paymentIntent.payment_method)
    orderData.paymentType = paymentMethod.type

    // Run the function
    writeOrderInTransaction().then(response => {
          res.status(200).send(response);
      }).catch(error => {
          res.status(500).send(error);
      });

  } catch (error) {
    console.log(error.message)
  }
}

export const orderShipOut = async (req, res) => {

}

export const orderReceived = async (req, res) => {

}

export const orderCompleted = async (req, res) => {

}

export const getUserOrder = async (req, res) => {
  const userId = req.user;

  try {
    // Query Firestore to get orders for the given user
    const userOrderRef = db
      .collection(COLLECTIONS.ORDER)
      .where("customerID", "==", userId);
    const snapshot = await userOrderRef.get();

    // Map the documents to extract order data and card details
    const cart = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();

        return {
          id: doc.id, // Include document ID for reference
          ...data,
        };
      })
    );

    // Send the cart data back to the client
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
};

export const getOrderDetail = async (req, res) => {
  const userId = req.user;
  const {order_ID} = req.body

  try {
    
    const data = await db.collection(COLLECTIONS.ORDER).doc(order_ID).get()

    if (data.data().customerID !== userId){
      return res.status(400).send("Invalid permission")
    }

    // Send the cart data back to the client
    res.status(200).json(data.data());
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
}

export const getAllOrder = async (req, res) => {
  try {
      const userOrderRef = db.collection(COLLECTIONS.ORDER);
      const snapshot = await userOrderRef.get();

      const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
      }));

      res.status(200).send(orders);
  } catch (error) {
      console.error("Error retrieving orders:", error);
      res.status(500).json({ success: false, error: 'Failed to retrieve orders' });
  }
};

