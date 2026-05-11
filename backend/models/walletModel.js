const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true }, 
    balance: { type: Number, default: 0, min: 0 },
    totalCredits: { type: Number, default: 0, min: 0 },
    totalDebits: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    lastTransactionAt: { type: Date }, 
}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);