import { Form, InputNumber, Modal } from "antd";
import React from "react";

const TotalAmountInput = ({
  isModalOpen,
  onCloseModal,
  expenseLimit,
  onUpdateExpenseLimit,
  expenses,
}) => {
  const [form] = Form.useForm();

  const onSubmit = async () => {
    try {
      const value = await form.validateFields();
      onCloseModal();
      onUpdateExpenseLimit(value);
    } catch (error) {}
  };

  const validateAmount = (_, value) => {
    if (value === null) return Promise.resolve();
    if (value <= 0) return Promise.reject("Invalid amount entered");
    let totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    if (value < totalExpenses) {
      return Promise.reject(
        "Expense limit cannot be less than total amount spent"
      );
    } else {
      return Promise.resolve();
    }
  };

  return (
    <Modal
      title="Set Expense Limit"
      open={isModalOpen}
      onOk={onSubmit}
      onCancel={onCloseModal}
      okButtonProps={{
        className: "bg-blue-500",
        disabled: !form.isFieldsValidating,
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ amount: expenseLimit }}
      >
        <Form.Item
          rules={[
            { required: true, message: "Expense limit is required" },
            () => ({
              validator: validateAmount,
            }),
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

export default TotalAmountInput;
