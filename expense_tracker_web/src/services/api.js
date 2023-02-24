const BASE_URL = "http://localhost:3000/api";

export const fetchExpenseTypesApi = async () => {
  const response = await fetch(`${BASE_URL}/expensetypes`);
  return await response.json();
};

export const fetchExpensesApi = async () => {
  const response = await fetch(`${BASE_URL}/expenses`);
  return await response.json();
};

export const createExpenseApi = async (data) => {
  const response = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const updateExpenseApi = async (data) => {
  const response = await fetch(`${BASE_URL}/expenses/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: data.amount,
      description: data.description,
      expenseTypeId: data.expenseTypeId,
    }),
  });
  return await response.json();
};

export const deleteExpenseApi = async (id) => {
  const response = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: "DELETE",
  });
  return await response.json();
};

export const fetchExpenseMetadataApi = async () => {
  const response = await fetch(`${BASE_URL}/expensemetadata`);
  return await response.json();
};

export const updateExpenseMetadataApi = async (data) => {
  const response = await fetch(`${BASE_URL}/expensemetadata`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};
