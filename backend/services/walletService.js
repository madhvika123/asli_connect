const walletModel = require('../models/walletModel');
const walletTransactionModel = require('../models/walletTransactionModel');

const getMyWalletService = async(userId) => {
  const wallet = await walletModel.findOne({ userId });

  return { status: 200, success: true, message: "Wallet Balance Retrived", data: { walletId: wallet._id, balance: wallet.balance, totalCredits: wallet.totalCredits, totalDebits: wallet.totalDebits, lastTransactionAt: wallet.lastTransactionAt, isActive: wallet.isActive } };
};

const getWalletTransactionsService = async(userId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const transactions = await walletTransactionModel.find({ userId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

  const total = await walletTransactionModel.countDocuments({ userId });

  const formattedTransactions = transactions.map(txn => ({ transactionId: txn._id, type: txn.type, amount: txn.amount, reason: txn.reason, referenceType: txn.referenceType, referenceId: txn.referenceId, status: txn.status, createdAt: txn.createdAt }));

  return { status: 200, success: true, data: formattedTransactions, pagination: { total, page, pages: Math.ceil(total / limit) } };
};

const getWalletSummaryService = async (userId) => {
  const wallet = await walletModel.findOne({ userId });

  const txnCount = await walletTransactionModel.countDocuments({ userId });

  return { status: 200, success: true, data: { balance: wallet?.balance || 0, totalCredits: wallet?.totalCredits || 0, totalDebits: wallet?.totalDebits || 0, totalTransactions: txnCount }
  };
};


module.exports = { getMyWalletService, getWalletTransactionsService, getWalletSummaryService };