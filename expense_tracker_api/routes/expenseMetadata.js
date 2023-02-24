const express = require("express");
const ExpenseMetadata = require("../models/ExpenseMetadata");

const router = express.Router();

router.get("/", async (req, res) => {
  const expenseMetadata = await ExpenseMetadata.findOne();
  res.send(expenseMetadata);
});

router.put("/", async (req, res) => {
  const expenseMetadata = await ExpenseMetadata.findOneAndUpdate(
    {},
    { expenseLimit: req.body.expenseLimit },
    { new: true }
  );
  res.send(expenseMetadata);
});

module.exports = router;
