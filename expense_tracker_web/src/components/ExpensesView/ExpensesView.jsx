import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Table,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";

const dateFormateOptions = { month: "long", day: "numeric", year: "numeric" };

const ExpensesView = ({
  expenses,
  expenseTypes,
  onDeleteExpense,
  onSaveExpense,
  expenseLimit,
}) => {
  const [records, setRecords] = useState(expenses);
  const [form] = Form.useForm();
  const [editingRecordKey, setEditingRecordKey] = useState("");

  const expenseTypesOptions = useMemo(() => {
    return expenseTypes.map((e) => ({
      value: e._id,
      label: e.name,
    }));
  }, [expenseTypes]);

  const expenseTypesFilters = useMemo(() => {
    return expenseTypes.map((e) => ({ value: e._id, text: e.name }));
  }, [expenseTypes]);

  const isRecordEditing = (record) => record.key === editingRecordKey;

  const onRecordEdit = (record) => {
    setEditingRecordKey(record.key);
    form.setFieldsValue(record);
  };

  const onRecordDelete = (record) => {
    onDeleteExpense(record.key);
  };

  const onRecordSave = async (record) => {
    const value = await form.validateFields();
    setEditingRecordKey("");
    onSaveExpense({ id: record.key, ...value });
  };

  const onTableChange = (_, filters, sorter) => {
    let sortedRecords = expenses;
    if (filters.type) {
      sortedRecords = sortedRecords.filter((t) => {
        return filters.type.includes(t.expenseType);
      });
    }

    if (sorter.order === "ascend") {
      sortedRecords = sortedRecords.sort(
        (a, b) => a[sorter.field] - b[sorter.field]
      );
    }

    if (sorter.order === "descend") {
      sortedRecords = sortedRecords.sort(
        (a, b) => b[sorter.field] - a[sorter.field]
      );
    }

    setRecords([...sortedRecords]);
  };

  const expenseTableColumns = useMemo(() => {
    return [
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        editable: true,
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        editable: true,
        render: (typeId) => {
          const foundType = expenseTypes.find((e) => e._id === typeId);
          return <>{foundType.name}</>;
        },
        filters: expenseTypesFilters,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        sorter: true,
        editable: true,
        render: (value) => {
          const formattedAmount = value.toLocaleString("si-LK", {
            style: "currency",
            currency: "LKR",
          });
          return <>{formattedAmount}</>;
        },
      },
      {
        title: "Added date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: (_, record) => {
          const isEditable = isRecordEditing(record);
          return (
            <div className="flex justify-center items-center">
              {!isEditable ? (
                <Button type="link" onClick={() => onRecordEdit(record)}>
                  Edit
                </Button>
              ) : (
                <Button type="link" onClick={() => onRecordSave(record)}>
                  Save
                </Button>
              )}
              <Popconfirm
                title="Are you sure to delete?"
                onConfirm={() => onRecordDelete(record)}
                okButtonProps={{ className: "bg-blue-500" }}
              >
                <Button danger type="link">
                  Delete
                </Button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }, [isRecordEditing]);

  const mergedExpenseTableColumns = useMemo(() => {
    return expenseTableColumns.map((c) => {
      if (!c.editable) return c;
      return {
        ...c,
        onCell: (record) => {
          return {
            record,
            dataIndex: c.dataIndex,
            inputType: c.dataIndex === "amount" ? "number" : "text",
            title: c.title,
            editing: isRecordEditing(record),
            expenseTypesOptions,
            expenses,
            expenseLimit,
          };
        },
      };
    });
  }, [expenseTableColumns, isRecordEditing]);

  const expenseTableData = useMemo(() => {
    return records.map((r) => {
      return {
        key: r._id,
        description: r.description,
        type: r.expenseType,
        amount: r.amount,
        date: new Date(r.createdDate).toLocaleString(
          "en-US",
          dateFormateOptions
        ),
      };
    });
  }, [records]);

  useEffect(() => {
    setRecords(expenses);
  }, [expenses]);

  return (
    <div>
      <Form form={form} component={false}>
        <Table
          columns={mergedExpenseTableColumns}
          dataSource={expenseTableData}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          onChange={onTableChange}
        />
      </Form>
    </div>
  );
};

function EditableCell({
  editing,
  dataIndex,
  inputType,
  title,
  index,
  children,
  record,
  expenseTypesOptions,
  expenses,
  expenseLimit,
  ...rest
}) {
  const inputElement = inputType === "number" ? <InputNumber /> : <Input />;

  const inputValidator = (_, value) => {
    if (dataIndex === "amount") {
      if (value === null) return Promise.resolve();
      if (value <= 0) return Promise.reject("Invalid amount entered");
      let totalExpenses =
        expenses.reduce((acc, curr) => {
          return acc + curr.amount, 0;
        }) + value;
      if (totalExpenses > expenseLimit) {
        return Promise.reject(
          "Total spent cannnot be more than the expense limit"
        );
      } else {
        return Promise.resolve();
      }
    }
    return Promise.resolve();
  };

  return (
    <>
      <td {...rest}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            rules={[
              { required: true, message: "Required filed" },
              () => ({ validator: inputValidator }),
            ]}
          >
            {dataIndex === "type" ? (
              <Select options={expenseTypesOptions} />
            ) : (
              inputElement
            )}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    </>
  );
}

export default ExpensesView;
