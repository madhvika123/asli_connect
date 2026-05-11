const logger = require('../utils/logger');
const { getMyWalletService, getWalletTransactionsService, getWalletSummaryService } = require('../services/walletService');

const getMyWalletController = async(req, res) => {
  try {
    const follow = await getMyWalletService(req.user.id);
    res.status(follow.status).json(follow);
  } catch (err) {
    logger.error('Error in Wallet API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const getMyWalletTransactionController = async(req, res) => {
  try {
    const follow = await getWalletTransactionsService(req.user.id, req.query);
    res.status(follow.status).json(follow);
  } catch (err) {
    logger.error('Error in Wallet Transaction API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const getWalletSummaryController = async(req, res) => {
  try {
    const follow = await getWalletSummaryService(req.user.id);
    res.status(follow.status).json(follow);
  } catch (err) {
    logger.error('Error in WALLET SUMMARY API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

module.exports = { getMyWalletController, getMyWalletTransactionController, getWalletSummaryController };