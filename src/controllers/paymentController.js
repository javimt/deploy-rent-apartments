const { User, Apartment } = require("../../db");
const {Stripe} = require('stripe')

const stripe = new Stripe(process.env.STRIPE_KEY)

module.exports = {
  createSession: async (req, res) => {
    const session = stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            product_data: {
              name: 'apartment',
              description: 'Guayacan de la plaza 1005'
            },
            currency: 'usd',
            unit_amount: 800
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: 'http://localhost:3001/success',
      cancel_url: 'http://localhost:3001/cancel'
    })
    return res.json(session)
  },


}