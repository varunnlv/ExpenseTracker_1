// rrd imports
import { Link, useLoaderData } from "react-router-dom";

// library imports
import { toast } from "react-toastify";

// components
import Intro from "../components/Intro";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

//  helper functions
import {
  createBudget,
  createExpense,
  deleteItem,
  fetchData,
  waait,
} from "../helpers";

// loader
export function dashboardLoader() {
  const userName = fetchData("userName");
  const Password = fetchData("password");
  const budgets = fetchData("budgets");
  const expenses = fetchData("expenses");
  return { userName, budgets, expenses };
}

// action
export async function dashboardAction({ request }) {
  console.log('started intially0 ');
  toast.success(`Logging in `);
  await waait();

  console.log('started intially');
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);
  toast.success(`started intially`);
  // new user submission
  if (_action === "newUser") {
    try {
      localStorage.setItem("userName", JSON.stringify(values.userName));
      localStorage.setItem("password", JSON.stringify(values.password));
      console.log('Please Wait... ');
      // Fetch all users from the server
      const usersResponse = await fetch('https://expensetracker-1-5eht.onrender.com/users');
      const users = await usersResponse.json();

      console.log('1');

      // Check if the username already exists in the users database
      const existingUser = users.find(user => user.username === values.userName);
      if (existingUser) {
        console.log('already exists');

        // Make a GET request to the server to retrieve userId based on username
        const response = await fetch(`https://expensetracker-1-5eht.onrender.com/users?username=${values.userName}`);
        const userData = await response.json();

        if (!userData || userData.length === 0) {
          throw new Error("User not found.");
        }

        const userId = userData[0].id;

        const usersResponse2 = await fetch('https://expensetracker-1-5eht.onrender.com/budgets');
        const budgets2 = await usersResponse2.json();


        // // Filter budgets by userId
        const userBudgets = budgets2.filter(budget => budget.userId === userId);
        console.log(userBudgets);

        // Loop over userBudgets and create budgets
        userBudgets.forEach(async budget => {
          try {
            await createBudget({
              name: budget.budgetname,
              amount: budget.budgetamount,
            });
            console.log(`Budget ${budget.budgetname} created.`);
          } catch (error) {
            console.error(`Error creating budget ${budget.budgetname}:`, error);
          }
        });



        const usersResponse3 = await fetch('https://expensetracker-1-5eht.onrender.com/expenses');
        const budgets3 = await usersResponse3.json();

        // // Filter budgets by userId
        const userexpenses = budgets3.filter(expense => expense.budgetId === userId);
        console.log(userexpenses);




        // Loop over userBudgets and create budgets
        userexpenses.forEach(async expense => {
          try {
            createExpense({
              name: values.newExpense,
              amount: values.newExpenseAmount,
              budgetId: values.newExpenseBudget,
            });
            console.log(`Budget ${expense.expensename} created.`);
          } catch (error) {
            console.error(`Error creating budget ${budget.budgetname}:`, error);
          }
        });











      }
      else {

        const newUser = {
          username: values.userName,
          password: values.password,
        };

        console.log('2');
          try{
    
               
            await fetch('https://expensetracker-1-5eht.onrender.com/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newUser),
            });
    
            console.log('New user created');
    
             } catch (e) {
          throw new Error("There was a problem creating your user.");
        }
      }


      return toast.success(`Welcome, ${values.userName}`);
    } catch (e) {
      throw new Error("There was a problem creating your account.");
    }
  }

  if (_action === "createBudget") {
    try {
      createBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount,
      });


      const username = JSON.parse(localStorage.getItem("userName")); // Retrieve username from localStorage

      // Make a GET request to the server to retrieve userId based on username
      const response = await fetch(`https://expensetracker-1-5eht.onrender.com/users?username=${username}`);
      const userData = await response.json();

      if (!userData || userData.length === 0) {
        throw new Error("User not found.");
      }

      const userId = userData[0].id;

      const newBudget = {
        budgetname: values.newBudget,
        budgetamount: values.newBudgetAmount,
        userId: userId,
      };

      await fetch(`https://expensetracker-1-5eht.onrender.com/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBudget),
      });
      return toast.success("Budget created!");
    } catch (e) {
      throw new Error("There was a problem creating your budget.");
    }
  }

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

      const userId8 = userData[0].id;

      console.log(userData[0].id);


      // // Make a GET request to the server to retrieve userId based on username
      const response2 = await fetch(`https://expensetracker-1-5eht.onrender.com/budgets?userId=${userId8}`);
      const userData2 = await response2.json();

      if (!userData2 || userData2.length === 0) {
        throw new Error("Budget not found.");
      }

      const userId2 = userData2[0].id;




      //Retrieve the budget name and expense details from the form values
      const newExpense = {
        expensename: values.newExpense,
        expenseamount: values.newExpenseAmount,
        budgetId: userId2,
      };

      //console.log("not working");



      // // Make a POST request to create the expense
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
      window.location.reload();
      return toast.success("Expense deleted!");
    } catch (e) {
      throw new Error("There was a problem deleting your expense.");
    }
  }
}

const Dashboard = () => {
  const { userName, budgets, expenses } = useLoaderData();

  return (
    <>
      {userName ? (
        <div className="dashboard">
          <h1>
            Welcome back, <span className="accent">{userName}</span>
          </h1>
          <div className="grid-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm />
                  <AddExpenseForm budgets={budgets} />
                </div>
                <h2>Existing Budgets</h2>
                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetItem key={budget.id} budget={budget} />
                  ))}
                </div>
                {expenses && expenses.length > 0 && (
                  <div className="grid-md">
                    <h2>Recent Expenses</h2>
                    <Table
                      expenses={expenses
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0, 8)}
                    />
                    {expenses.length > 8 && (
                      <Link to="expenses" className="btn btn--dark">
                        View all expenses
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid-sm">
                <p>Personal budgeting is the secret to financial freedom.</p>
                <p>Create a budget to get started!</p>
                <AddBudgetForm />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
};
export default Dashboard;
