const mongoose = require("mongoose");

const expenseMetadataSchema = new mongoose.Schema({
  expenseLimit: Number,
});

const ExpenseMetadata = mongoose.model(
  "ExpenseMetadata",
  expenseMetadataSchema
);

module.exports = ExpenseMetadata;
