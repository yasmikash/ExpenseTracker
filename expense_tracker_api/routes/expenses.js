const express = require("express");
const Expense = require("../models/Expense");
const ExpenseType = require("../models/ExpenseType");

const router = express.Router();

router.get("/", async (req, res) => {
  const expenses = await Expense.find().sort({ createdDate: -1 });
  res.send(expenses);
});

router.get("/:id", async (req, res) => {
  const expense = await Expense.findById(req.params.id).populate("expenseType");
  if (!expense) return res.status(404).send("Expense not found.");
  res.send(expense);
});

router.post("/", async (req, res) => {
  const expenseType = await ExpenseType.findById(req.body.expenseTypeId);
  if (!expenseType) return res.status(400).send("Invalid expense type.");

  const expense = new Expense({
    description: req.body.description,
    amount: req.body.amount,
    createdDate: new Date(),
    expenseType: expenseType._id,
  });
  await expense.save();
  res.send(expense);
});

router.put("/:id", async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(
    req.params.id,
    {
      description: req.body.description,
      amount: req.body.amount,
      expenseType: req.body.expenseTypeId,
    },
    { new: true }
  ).populate("expenseType");
  if (!expense) return res.status(404).send("Expense not found.");
  res.send(expense);
});

router.delete("/:id", async (req, res) => {
  const expense = await Expense.findByIdAndRemove(req.params.id);
  if (!expense) return res.status(404).send("Expense not found.");
  res.send(expense);
});

module.exports = router;
