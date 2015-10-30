module.exports = {
  PORT: process.env.PORT || 3000,
  HOSTNAME: process.env.HOSTNAME || 'localhost',
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/stripe-demo',
  STRIPE_SECRET_KEY: 'sk_test_hhT2zcYGf4lgbUfhYx0dL1bS',
  STRIPE_PUBLIC_KEY: 'pk_test_pPH475yhqYOtW3Uy9ymRDCoE'
};
