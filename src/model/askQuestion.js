const mongoose = require("mongoose");

const qusAnsSchema = new mongoose.Schema(
  {
    qus: {
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

module.exports=new mongoose.model("qusAns",qusAnsSchema);
