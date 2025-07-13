// backend/routes/stripe.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51Oqyo3Ap5li0mnBdPp3VP8q3NWQGnkM2CqvQkF6VV6GRPB0JdbNAX1UGIhjdlZghTj0MGg5GzRI5pHp5clQa9wAO005TR3ezz8');

router.post('/create-payment-intent', async (req, res) => {
  const { amount, description } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe needs cents
      currency: 'usd',
      description,
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
