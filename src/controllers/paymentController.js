//const { PayPal } = require("paypal-js");

module.exports = {

createOrder : async (totalAmount, currency = 'USD') => {
  try {
    const response = await fetch('https://api.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`, // Reemplaza con tu token de acceso de PayPal
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: totalAmount.toString(),
            },
          },
        ],
      }),
    });
  console.log(response)

    const order = await response.json();
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
},

rejectOrder : async (orderId) => {
  try {
    const response = await fetch(`https://api.paypal.com/v2/checkout/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
      },
    });

    if (response.status === 204) {
      console.log('Order rejected successfully');
      return true;
    } else {
      throw new Error('Failed to reject order');
    }
  } catch (error) {
    console.error('Error rejecting order:', error);
    throw new Error('Failed to reject order');
  }
},

cancelOrder : async (orderId) => {
  try {
    const response = await fetch(`https://api.paypal.com/v2/checkout/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`, // Reemplaza con tu token de acceso de PayPal
      },
    });

    if (response.status === 204) {
      console.log('Order canceled successfully');
      return true;
    } else {
      throw new Error('Failed to cancel order');
    }
  } catch (error) {
    console.error('Error canceling order:', error);
    throw new Error('Failed to cancel order');
  }
}

}