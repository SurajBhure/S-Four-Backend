const stripe = require("stripe")(process.env.STRIPE_KEY);
const User = require("../models/user.model");
const orderModel = require("../models/order.model");
const ProductModel = require("../models/product.model");

class paymentCtrl {
  static async paymentProcess(req, res) {
    const { cart, id } = req.body;
    // console.log("cart fron req.body",cart); // wee are getting cart as an array format so

    //for useremail we need user to fetch the user from user.model
    const user = await User.findOne({ _id: id });
    // console.log(user);
    if (!user) {
      return res.status(404).send({ error: "user not found!!!" });
    }
    const orderData = cart.map((item) => {
      return {
        _id: item._id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        userId: user._id,
      };
    });
    const customer = await stripe.customers.create({
      // create user to store the orders in DB
      email: user.email,
      metadata: {
        cart: JSON.stringify(orderData),
      },
    });
    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: { allowed_countries: ["IN"] },

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "inr" },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
      line_items: cart.map((item) => {
        const percentage = item.discount / 100; // to fetchc the discounted price we need this formula
        let actualPrice = item.price - item.price * percentage;
        actualPrice = parseFloat(actualPrice);
        actualPrice *= 100; // the stripe payment is not given the correct price so we need to multiple it by 100
        actualPrice = actualPrice.toFixed(1); // parseFloat changes the no like 34.123 to 34.1
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.title,
            },
            unit_amount_decimal: actualPrice,
          },
          quantity: item.quantity,
        };
      }),
      customer: customer.id,
      mode: "payment",
      success_url: `${process.env.CLIENTURL}/user?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENTURL}/cart`,
    });

    res.send({ url: session.url });
  }
  static async checkOutSession(req, res) {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.ENDPOINT_SECRET
      );
    } catch (err) {
      console.log(err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      case "checkout.session.completed":
        const data = event.data.object;
        let customer = await stripe.customers.retrieve(data.customer);

        customer = JSON.parse(customer);
        customer.forEach(async (ctr) => {
          try {
            await orderModel.create({
              productId: ctr._id,
              userId: ctr.userId,
              size: ctr.size,
              color: ctr.color,
              quantities: ctr.quantity,
              address: ctr.data.customer_details.address,
            });
            const product = await ProductModel.findOne({ _id: ctr._id }); // we have to minus product from stock here
            if (product) {
              let stock = product.stock - ctr.quantity;
              if (stock < 0) {
                stock = 0;
              }
              await ProductModel.findByIdAndUpdate(
                { _id: ctr._id },
                { stock },
                { new: true }
              );
            }
          } catch (error) {
            console.log(error.message);
            res.status(500).send({ error, message: "Server Internal error" });
          }
        });
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  }
}

module.exports = paymentCtrl;
