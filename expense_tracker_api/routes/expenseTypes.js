const express = require("express");
const ExpenseType = require("../models/ExpenseType");

const router = express.Router();

router.get("/", async (req, res) => {
  const expenseTypes = await ExpenseType.find().sort("name");
  res.send(expenseTypes);
});

router.get("/:id", async (req, res) => {
  const expenseType = await ExpenseType.findById(req.params.id);
  if (!expenseType) return res.status(404).send("Expense type not found.");
  res.send(expenseType);
});

router.post("/", async (req, res) => {
  const expenseType = new ExpenseType({
    name: req.body.name,
  });
  await expenseType.save();
  res.send(expenseType);
});

router.put("/:id", async (req, res) => {
  const expenseType = await ExpenseType.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  if (!expenseType) return res.status(404).send("Expense type not found.");
  res.send(expenseType);
});

router.delete("/:id", async (req, res) => {
  const expenseType = await ExpenseType.findByIdAndRemove(req.params.id);
  if (!expenseType) return res.status(404).send("Expense type not found.");
  res.send(expenseType);
});

module.exports = router;
