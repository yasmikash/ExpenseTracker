import { Button, Empty } from "antd";
import { useCallback, useEffect, useState } from "react";
import { ExpenseInput } from "../components/ExpenseInput";
import { ExpensesView } from "../components/ExpensesView";
import { TotalAmountInput } from "../components/TotalAmount";
import { PlusCircleOutlined } from "@ant-design/icons";
import { StatView } from "../components/StatView";
import { PieChart } from "../components/PieChart";
import {
  createExpenseApi,
  deleteExpenseApi,
  fetchExpenseMetadataApi,
  fetchExpensesApi,
  fetchExpenseTypesApi,
  updateExpenseApi,
  updateExpenseMetadataApi,
} from "../services/api";

const ExpenseContainer = () => {
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [isExpenseLimitModalOpen, setExpenseLimitModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [expenseLimit, setExpenseLimit] = useState(0);
  const [expenseTypes, setExpenseTypes] = useState([]);

  const onAddExpense = async (expense) => {
    try {
      await createExpenseApi({
        amount: expense.amount,
        description: expense.description,
        expenseTypeId: expense.type,
      });
      const updatedExpenses = await fetchExpensesApi();
      setExpenses(updatedExpenses);
    } catch (error) {
      alert("Error occured while adding the expense");
    }
  };

  const onDeleteExpense = async (id) => {
    try {
      await deleteExpenseApi(id);
      const updatedExpenses = await fetchExpensesApi();
      setExpenses(updatedExpenses);
    } catch (error) {
      alert("Error occured while deleting the expense");
    }
  };

  const onSaveExpense = async (data) => {
    try {
      await updateExpenseApi({
        amount: data.amount,
        description: data.description,
        expenseTypeId: data.type,
        id: data.id,
      });
      const updatedExpenses = await fetchExpensesApi();
      setExpenses(updatedExpenses);
    } catch (error) {
      alert("Error occured while updating the expense");
    }
  };

  const onUpdateExpenseLimit = async (value) => {
    try {
      await updateExpenseMetadataApi({ expenseLimit: value.amount });
      const updatedMetadata = await fetchExpenseMetadataApi();
      setExpenseLimit(updatedMetadata.expenseLimit);
    } catch (error) {
      alert("Error occured while updating the metadata");
    }
  };

  const onCloseExpenseModal = () => {
    setExpenseModalOpen(false);
  };

  const onOpenExpenseModal = () => {
    setExpenseModalOpen(true);
  };

  const onCloseExpenseLimitModal = () => {
    setExpenseLimitModalOpen(false);
  };

  const onOpenExpenseLimitModal = () => {
    setExpenseLimitModalOpen(true);
  };

  const onCalcPercentage = useCallback(() => {
    let totalAmount = expenses.reduce((acc, curr) => curr.amount + acc, 0);
    const percentage = ((totalAmount / expenseLimit) * 100).toFixed(2);
    return isNaN(percentage) ? (0).toFixed(2) : percentage;
  }, [expenses, expenseLimit]);

  useEffect(() => {
    const fetchExpenseTypes = async () => {
      try {
        const expenseTypes = await fetchExpenseTypesApi();
        setExpenseTypes(expenseTypes);
      } catch (error) {
        alert("Error occured while fetching expense types");
      }
    };

    const fetchExpenses = async () => {
      try {
        const expenses = await fetchExpensesApi();
        setExpenses(expenses);
      } catch (error) {
        alert("Error occured while fetching expenses");
      }
    };

    const fetchExpenseMetadata = async () => {
      try {
        const metadata = await fetchExpenseMetadataApi();
        setExpenseLimit(metadata.expenseLimit);
      } catch (error) {
        alert("Error occured while fetching expense metadata");
      }
    };

    fetchExpenseTypes();
    fetchExpenses();
    fetchExpenseMetadata();
  }, []);

  return (
    <div className="flex items-start justify-center bg-slate-200 h-screen">
      <div className="w-[80%] bg-white h-full p-4">
        <div className="flex gap-2 justify-between m-4 items-center">
          <StatView
            onCalcPercentage={onCalcPercentage}
            expenseLimit={expenseLimit}
          />
          {expenseTypes.length > 0 && expenses.length ? (
            <PieChart expenseTypes={expenseTypes} expenses={expenses} />
          ) : (
            <Empty
              description="No data to be shown in Pie chart"
              className="h-[400px]"
            />
          )}
          <div className="flex gap-4">
            <Button
              className="bg-blue-500 flex items-center"
              type="primary"
              onClick={onOpenExpenseModal}
              size="large"
              disabled={expenseLimit <= 0}
            >
              <PlusCircleOutlined />
              <span>Add Expense</span>
            </Button>
            <Button size="large" onClick={onOpenExpenseLimitModal}>
              Update Expense Limit
            </Button>
          </div>
        </div>
        <ExpenseInput
          isModalOpen={isExpenseModalOpen}
          onAddExpense={onAddExpense}
          onCloseModal={onCloseExpenseModal}
          expenseTypes={expenseTypes}
          expenseLimit={expenseLimit}
          expenses={expenses}
        />
        <TotalAmountInput
          expenseLimit={expenseLimit}
          isModalOpen={isExpenseLimitModalOpen}
          onCloseModal={onCloseExpenseLimitModal}
          onUpdateExpenseLimit={onUpdateExpenseLimit}
          expenses={expenses}
        />

        {expenseTypes.length > 0 && expenses.length > 0 ? (
          <ExpensesView
            expenses={expenses}
            onDeleteExpense={onDeleteExpense}
            expenseTypes={expenseTypes}
            onSaveExpense={onSaveExpense}
            expenseLimit={expenseLimit}
          />
        ) : (
          <Empty description="No data to be shown" className="h-[400px]" />
        )}
      </div>
    </div>
  );
};

export default ExpenseContainer;
