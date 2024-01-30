const axios = require("axios");

module.exports = {
  createOrder: async (req, res) => {
    const {price, userId, apartmentId} = req.body;
    try {
      const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price
          },
        },
      ],
      application_context: {
        brand_name: "Furnished Apartments Medellin",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${process.env.BACK_URL}/checkout/capture-order`,
        cancel_url: `${process.env.BACK_URL}/cancel-order`
      }
    }
    } catch (error) {
      
    }
    //const api = 'https://api-m.paypal.com/v2/checkout/orders'
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const { data: {access_token} } = await axios.post(`${process.env.PAYPAL_API}/v1/oauth2/token`, params, {
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_SECRET_KEY
      }
    });
 //console.log(process.env.PAYPAL_API)
    const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders`, order, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    res.json('create order')
  },

  rejectOrder: async (req, res) => {

  },

  cancelOrder: async (req, res) => {
    
  },
  
}
