// rrd imports
import { useLoaderData } from "react-router-dom";

// library import
import { toast } from "react-toastify";

// component imports
import Table from "../components/Table";

// helpers
import { deleteItem, fetchData } from "../helpers";

// loader
export async function expensesLoader() {
  const expenses = fetchData("expenses");
  return { expenses };
}

// action
export async function expensesAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);


  if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: values.expenseId,
      });


      const username = JSON.parse(localStorage.getItem("userName")); // Retrieve username from localStorage

      // Make a GET request to the server to retrieve userId based on username
      const response = await fetch(`/api/users?username=${username}`);
      const userData = await response.json();

      if (!userData || userData.length === 0) {
        throw new Error("User not found.");
      }

      const userId = userData[0].id;


      // Make a GET request to the server to retrieve userId based on username
      const response2 = await fetch(`/api/budgets?userId=${userId}`);
      const userData2 = await response.json();

      if (!userData2 || userData2.length === 0) {
        throw new Error("Budget not found.");
      }

      const userId2 = userData2[0].id;


      // Make a GET request to the server to retrieve userId based on username
      const response3 = await fetch(`/api/expenses?budgetId=${userId2}`);
      const userData3 = await response.json();

      if (!userData3 || userData3.length === 0) {
        throw new Error("Budget not found.");
      }

      const userId3 = userData3[0].id;






      const expenseId = userId3;


      // Then, make a DELETE request to delete the expense from the server
      await fetch(`/api/expenses/${expenseId}`, {
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

const ExpensesPage = () => {
  const { expenses } = useLoaderData();

  return (
    <div className="grid-lg">
      <h1>All Expenses</h1>
      {expenses && expenses.length > 0 ? (
        <div className="grid-md">
          <h2>
            Recent Expenses <small>({expenses.length} total)</small>
          </h2>
          <Table expenses={expenses} />
        </div>
      ) : (
        <p>No Expenses to show</p>
      )}
    </div>
  );
};

export default ExpensesPage;
