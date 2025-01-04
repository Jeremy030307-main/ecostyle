import Stripe from "stripe";

const stripe = new Stripe("sk_test_51PnWiiGrBUkxkf9EdcXsp1T9Fn665nEHB6O4S71UTyBO3Vv3K3qxBmoAT2qmU3Br6W6XYZ7o22o9OZlS6XcEquBf00KwLFLKNI")

export const createStripeCustomer = async (name, email) => {

  const customer = await stripe.customers.create({
    name: name,
    email: email
  })

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

export const createPayment = async (req, res) => {

    const {items} = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
    });
    
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
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

