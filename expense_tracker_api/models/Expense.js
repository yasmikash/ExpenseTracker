const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  createdDate: Date,
  expenseType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExpenseType",
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
