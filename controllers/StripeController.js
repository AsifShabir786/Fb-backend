// controllers/StripeController.js
const stripe = require('stripe')('sk_test_51Oqyo3Ap5li0mnBdPp3VP8q3NWQGnkM2CqvQkF6VV6GRPB0JdbNAX1UGIhjdlZghTj0MGg5GzRI5pHp5clQa9wAO005TR3ezz8'); // replace with your Stripe secret key

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency='usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentIntent };
