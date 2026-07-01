const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { amount } = req.body; // Amount in INR

    // Ensure API keys are present (Mock if not for local dev)
    const key_id = process.env.RAZORPAY_KEY_ID || 'mock_key_id';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret';

    if (key_id === 'mock_key_id') {
      // Mock successful response for local development without keys
      return res.status(200).json({
        id: `order_mock_${Date.now()}`,
        currency: 'INR',
        amount: amount * 100
      });
    }

    try {
      const razorpay = new Razorpay({
        key_id,
        key_secret
      });

      const options = {
        amount: amount * 100, // Razorpay works in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      };

      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create Razorpay order' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
