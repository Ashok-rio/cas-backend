const mongoose = require("mongoose");

const BusFeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  personId: {
    type: String,
    required: true,
  },
  busNumber: {
    type: String,
  },
  busFees: [
    {
      semesterName: {
        type: String,
      },
      semesterFees: {
        type: Number,
        default: 0
      },
      pending: {
        type: Boolean,
        default: true,
      },
      paidFees: {
        type: Number,
        default: 0
      },
      pendingFees: {
        type: Number,
        default: 0
      },
      fine: {
        type: Boolean,
        default: false,
      },
      fineAmt: {
        type: Number,
        default: 0
      },
    },
  ],
});

module.exports = new mongoose.model('BusFee',BusFeeSchema);