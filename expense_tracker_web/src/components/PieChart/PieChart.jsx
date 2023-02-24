import { Pie } from "@ant-design/plots";
import { Empty } from "antd";
import React, { useMemo, memo } from "react";

const PieChart = ({ expenses, expenseTypes }) => {
  const data = useMemo(() => {
    const data = [];
    expenses.forEach((e) => {
      const foundData = data.find(
        (d) =>
          d.type === expenseTypes.find((t) => t._id === e.expenseType)?.name
      );
      if (foundData) {
        foundData.value += e.amount;
      } else {
        data.push({
          type: expenseTypes.find((t) => t._id === e.expenseType).name,
          value: e.amount,
        });
      }
    });
    return data;
  }, [expenseTypes, expenses]);

  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  if (!data.length)
    return (
      <Empty
        description="No data to be shown in Pie chart"
        className="h-[400px]"
      />
    );

  return <Pie height={400} {...config} />;
};

export default memo(PieChart);
