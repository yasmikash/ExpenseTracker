import React from "react";

const StatView = ({ onCalcPercentage, expenseLimit }) => {
  let textClassName = "text-green-500";
  const percentage = onCalcPercentage();
  if (percentage >= 90) {
    textClassName = "text-red-500";
  }

  return (
    <div className="p-4 shadow-md rounded-md border border-slate-50">
      <div className="flex flex-col gap-2">
        <h4 className="text-slate-600">Amount Spent</h4>
        <h2 className={`text-4xl font-semibold ${textClassName}`}>
          {onCalcPercentage()}%
        </h2>
        <h4 className="font-semibold text-slate-600">
          Expense Limit:{" "}
          {expenseLimit.toLocaleString("si-LK", {
            style: "currency",
            currency: "LKR",
          })}
        </h4>
      </div>
    </div>
  );
};

export default StatView;
