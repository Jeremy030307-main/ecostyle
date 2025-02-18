import admin from 'firebase-admin';
import { db } from "../firebase.js";
import { getLast$Digit, getPaymentIntentObject, getPaymentMethodObject } from "./paymentController.js";
import { COLLECTIONS, message } from "./utility.js"; 

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
          return { message: 'Failed to create order', error };
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

        let last4Digits = null;

        // Extract the PaymentIntent ID from the client secret
        const paymentIntentId = data.paymentDetails?.paymentID;

        if (paymentIntentId) {
          last4Digits = await getLast$Digit(paymentIntentId)
          console.log(last4Digits)
        }

        return {
          id: doc.id, // Include document ID for reference
          ...data,
          paymentDetails: {
            ...data.paymentDetails,
            cardLast4: last4Digits, // Add the last 4 digits of the card
          },
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

export const getAllOrder = (req, res) => {
    
    /// Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Content-Encoding', "none");
    res.flushHeaders(); // Flush headers to establish SSE connection

    try {
        const userOrderRef = db.collection(COLLECTIONS.ORDER)
  
        // Set up a Firestore snapshot listener for real-time updates
        const unsubscribe = userOrderRef.onSnapshot(
        async (snapshot) => {
            const cart = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const orderData = {
                id: doc.id, // Include document ID for reference
                ...doc.data(),
                };
      
                return orderData;
            })
            );
    
            // Send the updated cart data to the client
            res.write(`data: ${JSON.stringify(cart)}\n\n`);
        },
        (error) => {
            console.error("Error listening to user cart changes:", error);
            res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
        }
        );
  
      // Handle connection close and clean up the listener
      req.on('close', () => {
        unsubscribe(); // Stop listening for changes
        res.end();
      });
    } catch (error) {
      console.error("Error setting up cart listener:", error);
      res.status(500).json({ error: 'Failed to retrieve cart' });
    }
};

