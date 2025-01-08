import Stripe from "stripe";
import { db } from "../firebase.js";
import { COLLECTIONS, message } from "./utility.js";

const stripe = new Stripe("sk_test_51PnWiiGrBUkxkf9EdcXsp1T9Fn665nEHB6O4S71UTyBO3Vv3K3qxBmoAT2qmU3Br6W6XYZ7o22o9OZlS6XcEquBf00KwLFLKNI")

async function createStripeCustomer(uid) {
  try {
    // Retrieve the user document
    console.log(uid)
    const userDocRef = db.collection(COLLECTIONS.USER).doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) { 
      throw new Error('User document does not exist.');
    }

    const userData = userDoc.data();

    // Check if the user already has a Stripe customer ID
    if (userData.stripeCustomerID) {
      console.log('Stripe customer already exists:', userData.stripeCustomerID);
      return userData.stripeCustomerID; // Return the existing Stripe customer ID
    }

    // Create a new Stripe customer if it doesn't exist
    const customer = await stripe.customers.create({name: uid});

    // Update the user document with the new Stripe customer ID
    await userDocRef.update({
      stripeCustomerID: customer.id,
    });

    console.log('New Stripe customer created and saved:', customer.id);
    return customer.id;

  } catch (error) {
    console.error('Error creating or retrieving Stripe customer:', error.message);
    throw new Error('Failed to create or retrieve Stripe customer.');
  }
}

async function createSetupIntent(userId) {

  const setupIntent = await stripe.setupIntents.create({
    customer: userId, // Use the dynamically retrieved customer ID
    automatic_payment_methods: {
      enabled: true,
    },
  });

  console.log(setupIntent)
  return setupIntent;
}

async function getClientID(uid) {
  try{
    // Retrieve the user document
    const userDocRef = db.collection(COLLECTIONS.USER).doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data();

    let cus_id = null;
    // Check if the user already has a Stripe customer ID
    if (userData.stripeCustomerID) {
      cus_id = userData.stripeCustomerID
    }

    return cus_id
  } catch (error) {
    return null
  }
}

export const getClientSecret = async(req, res) => {
  try{
    const userID = req.user;
    const customerID = await createStripeCustomer(userID);
    const intent = await createSetupIntent(customerID)
    res.json({client_secret: intent.client_secret});
  } catch (error) {
    res.status(400).send(message(error.message));
  }
}

export const getClientPaymentMethod = async (req, res) => {

  const uid = req.user
  try {

    // Retrieve the user document
    const userDocRef = db.collection(COLLECTIONS.USER).doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      throw new Error('User document does not exist.');
    }

    const userData = userDoc.data();
    let paymentMethods = []

    // Check if the user already has a Stripe customer ID
    if (userData.stripeCustomerID) {
      const result = await stripe.customers.listPaymentMethods(userData.stripeCustomerID, {
        type: 'card', // Specify the type of payment method
      });

      // Extract only necessary data
      paymentMethods = result.data.map((pm) => ({
        id: pm.id,
        brand: pm.card.brand,
        last4: pm.card.last4,
        exp_month: pm.card.exp_month,
        exp_year: pm.card.exp_year,
      }));
    }

    // Send the payment methods back to the client
    res.status(200).json({ paymentMethods });

  } catch (error) {
    res.status(400).send(message(error.message))
  }
}

export const deleteClientPaymentMethod = async (req, res) => {

  try {
    const {paymentID} = req.params
    const paymentMethod = await stripe.paymentMethods.detach(paymentID);

    res.status(200).send(message("Payment method deleted successful."))
  } catch (error) {
    res.status(400).send(message(error.message))
  }
}

export const createPayment = async (req, res) => {

    const {total} = req.body;

    console.log(total)
    try{
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "myr",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
    });
    
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).send(message(error.message))
  }
};

export const createCheckoutSession = async (req,res) => {
  const sesion = await stripe.checkout.sessions.create({
    currency: 'usd',
    mode: 'setup',
    ui_mode: 'embedded',
    customer: '',
    return_url: 'https://example.com/return?session_id={CHECKOUT_SESSION_ID}'
  });

  res.send({clientSecret: session.client_secret});
}

const calculateOrderAmount = (items) => {
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  let total = 0;
  items.forEach((item) => {
    total += item.amount;
  });
  return total;
};

