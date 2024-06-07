// rrd imports
import { useLoaderData } from "react-router-dom";

// library
import { toast } from "react-toastify";

// components
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

// helpers
import { createExpense, deleteItem, getAllMatchingItems } from "../helpers";

// loader
export async function budgetLoader({ params }) {
  const budget = await getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: params.id,
  })[0];

  const expenses = await getAllMatchingItems({
    category: "expenses",
    key: "budgetId",
    value: params.id,
  });

  if (!budget) {
    throw new Error("The budget you’re trying to find doesn’t exist");
  }

  return { budget, expenses };
}

// action
export async function budgetAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "createExpense") {
    try {
      createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
      });


      const username = JSON.parse(localStorage.getItem("userName")); // Retrieve username from localStorage

      // Make a GET request to the server to retrieve userId based on username
      const response = await fetch(`https://expensetracker-1-5eht.onrender.com/users?username=${username}`);
      const userData = await response.json();

      if (!userData || userData.length === 0) {
        throw new Error("User not found.");
      }

      const userId = userData[0].id;


      // Make a GET request to the server to retrieve userId based on username
      const response2 = await fetch(`https://expensetracker-1-5eht.onrender.com/budgets?userId=${userId}`);
      const userData2 = await response.json();

      if (!userData2 || userData2.length === 0) {
        throw new Error("Budget not found.");
      }

      const userId2 = userData2[0].id;




      // Retrieve the budget name and expense details from the form values
      const newExpense = {
        expensename: values.newExpense,
        expenseamount: values.newExpenseAmount,
        budgetId: userId2,
      };



      // Make a POST request to create the expense
      await fetch(`https://expensetracker-1-5eht.onrender.com/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });










      return toast.success(`Expense ${values.newExpense} created!`);
    } catch (e) {
      throw new Error("There was a problem creating your expense.");
    }
  }

  if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: values.expenseId,
      });


      const username = JSON.parse(localStorage.getItem("userName")); // Retrieve username from localStorage

      // Make a GET request to the server to retrieve userId based on username
      const response = await fetch(`https://expensetracker-1-5eht.onrender.com/users?username=${username}`);
      const userData = await response.json();

      if (!userData || userData.length === 0) {
        throw new Error("User not found.");
      }

      const userId = userData[0].id;


      // Make a GET request to the server to retrieve userId based on username
      const response2 = await fetch(`https://expensetracker-1-5eht.onrender.com/budgets?userId=${userId}`);
      const userData2 = await response.json();

      if (!userData2 || userData2.length === 0) {
        throw new Error("Budget not found.");
      }

      const userId2 = userData2[0].id;


      // Make a GET request to the server to retrieve userId based on username
      const response3 = await fetch(`https://expensetracker-1-5eht.onrender.com/expenses?budgetId=${userId2}`);
      const userData3 = await response.json();

      if (!userData3 || userData3.length === 0) {
        throw new Error("Budget not found.");
      }

      const userId3 = userData3[0].id;






      const expenseId = userId3;


      // Then, make a DELETE request to delete the expense from the server
      await fetch(`https://expensetracker-1-5eht.onrender.com/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return toast.success("Expense deleted!");
    } catch (e) {
      throw new Error("There was a problem deleting your expense.");
    }
  }
}

const BudgetPage = () => {
  const { budget, expenses } = useLoaderData();

  return (
    <div
      className="grid-lg"
      style={{
        "--accent": budget.color,
      }}
    >
      <h1 className="h2">
        <span className="accent">{budget.name}</span> Overview
      </h1>
      <div className="flex-lg">
        <BudgetItem budget={budget} showDelete={true} />
        <AddExpenseForm budgets={[budget]} />
      </div>
      {expenses && expenses.length > 0 && (
        <div className="grid-md">
          <h2>
            <span className="accent">{budget.name}</span> Expenses
          </h2>
          <Table expenses={expenses} showBudget={false} />
        </div>
      )}
    </div>
  );
};
export default BudgetPage;
