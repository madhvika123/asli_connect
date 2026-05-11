const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  walletId: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet", required: true, index: true },
  type: { type: String, enum: ["credit", "debit"], required: true, index: true }, 
  amount: { type: Number, required: true, min: 0 },
  reason: { type: String, trim: true },
  referenceId: { type: String, sparse: true, index: true },
  referenceType: { type: String, enum: ['job', 'order', 'refund'] },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'], default: 'completed', index: true },
  ip: { type: String } ,
  userAgent: { type: String },
}, { timestamps: true, read: 'primaryPreferred' });

walletTransactionSchema.index({ referenceId: 1, referenceType: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);