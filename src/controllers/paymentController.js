const axios = require("axios");

module.exports = {
  createOrder: async (req, res) => {
    const { price, userId, apartmentId } = req.body;
    
    try {
      const order = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price,
            },
          },
        ],
        application_context: {
          brand_name: "Furnished Apartments Medellin",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: `${process.env.BACK_URL}/checkout/capture-order`,
          cancel_url: `${process.env.BACK_URL}/cancel-order`,
        },
      };

      const accessToken = "TU_ACCESS_TOKEN_DE_PAYPAL"; // Debes obtener tu access token aquí

      const response = await axios.post(
        `${process.env.PAYPAL_API}/v2/checkout/orders`,
        order,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Aquí puedes manejar la respuesta de PayPal, por ejemplo, redirigiendo al usuario a la URL de aprobación de PayPal
      const { data } = response;
      const approvalLink = data.links.find(link => link.rel === 'approve');
      
      if (approvalLink) {
        return res.redirect(approvalLink.href);
      } else {
        return res.status(500).json({ error: 'No se pudo obtener el enlace de aprobación de PayPal' });
      }

    } catch (error) {
      console.error("Error al crear la orden de PayPal:", error);
      return res.status(500).json({ error: 'Error al crear la orden de PayPal' });
    }
  },

  rejectOrder: async (req, res) => {
    // Implementar lógica para rechazar la orden
  },

  cancelOrder: async (req, res) => {
    // Implementar lógica para cancelar la orden
  },
};
