const express = require("express");
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();

console.log(process.env.STRIPE_SECRET_KEY);

// Enable CORS for the frontend URL
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
// app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!"); // Testni odgovor
});

app.post("/create-checkout-session", async (req, res) => {
  console.log("Request body:", req.body);

  const amount = parseInt(req.body.amount, 10);
  const feeType = req.body.feeType;

  if (isNaN(amount)) {
    console.error("Invalid amount received:", req.body.amount);
    return res.status(400).send({ error: "Amount must be a number" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Fee Type: ${feeType}`,
              description: feeType,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      billing_address_collection: "required", // Zahtijeva adresu za naplatu
      phone_number_collection: {
        enabled: true,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(400).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
