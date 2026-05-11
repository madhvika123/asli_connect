const express = require('express');
const { getMyWalletController, getMyWalletTransactionController, getWalletSummaryController } = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// routes
// WALLET COINS || GET
router.get('/my-coins', authMiddleware, getMyWalletController);

// WALLET TRANSACTION || GET
router.get('/transactions',  authMiddleware, getMyWalletTransactionController);

// SUMMARY || GET
router.get('/summary', authMiddleware, getWalletSummaryController);

module.exports = router;