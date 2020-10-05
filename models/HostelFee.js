const mongoose = require("mongoose");

const HostelFeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  personId: {
    type: String,
    required: true,
  },
  hostel:[
    {
        semesterName: {
          type: String,
        },
        semesterFees: {
          type: String,
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
          type: String,
        },
        pendingFees: {
          type: String,
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
    mess:[{
        semesterName: {
            type: String,
          },
          monthName:{
              type:String,
          },
          monthFees: {
            type: String,
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
            type: String,
          },
          pendingFees: {
            type: String,
          },
    }],
});

module.exports = new mongoose.model('HostelFee',HostelFeeSchema);
