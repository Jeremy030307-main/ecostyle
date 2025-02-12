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

export async function getLast$Digit(clientSecret) {
  try {
    // Retrieve the PaymentIntent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret);

    // Get the last 4 digits of the card from the payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(
      paymentIntent.payment_method
    );

    const haha = paymentMethod.card?.last4 || null;

    return haha
  } catch (error) {
    console.error(`Error fetching payment details for PaymentIntent ${clientSecret}:`, error);
  }
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
  const { total, paymentMethodID, shipping } = req.body;
  const userID = req.user;

  const clientID = await getClientID(userID); // Fetch the customer ID for the logged-in user

  const intent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'myr',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {enabled: true},
    customer: clientID,
  });

  const customerSession = await stripe.customerSessions.create({
    customer: clientID,
    components: {
      payment_element: {
        enabled: true,
        features: {
          payment_method_redisplay: 'enabled',
          payment_method_allow_redisplay_filters: ['always', 'limited', 'unspecified'],
        },
      },
    },
  });

  res.json({
    client_secret: intent.client_secret,
    customer_session_client_secret: customerSession.client_secret
  });
};


