const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    fullname: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: "",
    },
    avatar: String,
    phone: Number,
    status: String,
    role_id: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
