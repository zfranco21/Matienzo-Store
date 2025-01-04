// server.js

const express = require('express');
const mercadopago = require('mercadopago');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de MercadoPago
mercadopago.configure({
  access_token: 'APP_USR-8319836583834407-022810-9b0f21f9495256e7603cda11dc707bce-502813911'
});

// Ruta para crear la sesión de checkout
app.post('/create-checkout-session', async (req, res) => {
  const { description, price, currency } = req.body;

  try {
    const preference = {
      items: [
        {
          title: description,
          unit_price: Number(price),
          quantity: 1
        }
      ],
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure',
        pending: 'http://localhost:3000/pending'
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_types: [{id: 'ticket'}],
        installments: 6
      }
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error('Error al crear la sesión de checkout:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
