const mongoose = require("mongoose");

const expenseTypeSchema = new mongoose.Schema({
  name: String,
});

const ExpenseType = mongoose.model("ExpenseType", expenseTypeSchema);

module.exports = ExpenseType;
