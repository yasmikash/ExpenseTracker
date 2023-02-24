import { Form, Input, InputNumber, Modal, Select } from "antd";
import React from "react";

const ExpenseInput = ({
  isModalOpen,
  onAddExpense,
  onCloseModal,
  expenseTypes,
  expenseLimit,
  expenses,
}) => {
  const expenseTypesOptions = expenseTypes.map((e) => ({
    value: e._id,
    label: e.name,
  }));

  const [form] = Form.useForm();

  const onSubmit = async () => {
    try {
      const value = await form.validateFields();
      form.resetFields();
      onCloseModal();
      onAddExpense(value);
    } catch (error) {}
  };

  const validateAmount = (_, value) => {
    if (value === null) return Promise.resolve();
    if (value <= 0) return Promise.reject("Invalid amount entered");
    let totalExpenses =
      expenses.reduce((acc, curr) => acc + curr.amount, 0) + value;
    if (totalExpenses > expenseLimit) {
      return Promise.reject(
        "Total spent cannnot be more than the expense limit"
      );
    } else {
      return Promise.resolve();
    }
  };

  return (
    <Modal
      title="Add Expense"
      open={isModalOpen}
      onOk={onSubmit}
      onCancel={onCloseModal}
      okButtonProps={{ className: "bg-blue-500" }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          rules={[{ required: true, message: "Description is required" }]}
          label="Description"
          name="description"
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 2 }}
            placeholder="Enter expense description"
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Expense type is required" }]}
          label="Type"
          name="type"
        >
          <Select
            options={expenseTypesOptions}
            placeholder="Select from expense types"
          />
        </Form.Item>
        <Form.Item
          rules={[
            { required: true, message: "Expense amount is required" },
            () => ({ validator: validateAmount }),
          ]}
          label="Amount (LKR)"
          name="amount"
        >
          <InputNumber
            className="w-[200px]"
            placeholder="Enter expense amount"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExpenseInput;
