const mongoose = require("mongoose");

const qusAnsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      require: true,
    },
    ans: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports=new mongoose.model("ans",qusAnsSchema);
