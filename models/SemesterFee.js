const mongoose = require("mongoose");

const SemFeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  personId: {
    type: Number,
  },
  course:{
    type:String,
    required:true
  },
  semester: [
    {
      semesterName: {
        type: String,
      },
      semesterFees: {
        type: Number,
      },
      paid: {
        type: Boolean,
        default: false,
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
        type: String,
      },
    },
  ],
});

module.exports = new mongoose.model('SemFee',SemFeeSchema);