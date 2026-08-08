import express from 'express';

const router = express.Router();

// Verify payment API simulation
router.post('/verify', (req, res) => {
  const { paymentMethod, amount } = req.body;
  const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

  res.json({
    success: true,
    status: 'SUCCESS',
    txnId,
    amount,
    paymentMethod,
    timestamp: new Date().toISOString(),
  });
});

export default router;
