import Stripe from "stripe";
import configService from "../config/config-service";

const stripeSecretKey =  configService.getOrElseThrow("STRIPE_KEY");

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-06-30.basil",
    typescript: true,
});

export default stripe;