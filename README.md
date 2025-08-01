
# Savings App Backend 💸

This is the backend for the **Savings App**, a personal finance application designed to track users' income, expenses, and goals. The app helps users manage their finances by allowing them to set financial goals, track transactions, and view summaries of their monthly income and expenses. 📊💰

## Features 🌟

- **User Authentication** 🔐: Users can register, log in, and manage their profiles.
- **Transaction Management** 🧾: Users can track their income and expenses, with categorization for better financial management.
- **Goal Management** 🎯: Users can set financial goals, specify target amounts, and track progress towards achieving them.

## Technologies Used ⚙️

- **Node.js**: Backend runtime environment.
- **Express**: Web framework for Node.js.
- **MongoDB**: Database to store user data, transactions, and goals.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **JWT (JSON Web Token)**: For user authentication and authorization.

# 📌 Available Routes

## **User** 👤

| **HTTP Method** | **Endpoint**               | **Description**                                                   | **Protected** | **Data Fields** |
|-----------------|----------------------------|-------------------------------------------------------------------|---------------|-----------------|
| **GET**         | `/api/v1/users`            | Fetch all users.                                                  | No            | Returns: `name`, `birthDate`, `email`, `profilePicture`, `monthlySalary`, `monthlyExpenses`, `totalExpenses`, `monthlyExpectedExpenses`, `totalExpectedExpenses`, `transactions[]`, `goals[]` |
| **GET**         | `/api/v1/users/:id`        | Fetch a specific user by ID, including transactions and goals.    | Yes           | Same as above, but only for the specified user. |
| **POST**        | `/api/v1/users/register`   | Register a new user.                                              | No            | Requires: `name`, `birthDate`, `email`, `password`, `repeatPassword` |
| **POST**        | `/api/v1/users/login`      | User login, returns JWT token.                                    | No            | Requires: `email`, `password`<br>Returns: `user` object, `token` |
| **PUT**         | `/api/v1/users/:id`        | Update user details.                                              | Yes           | Accepts: `name`, `birthDate`, `monthlySalary`, `monthlyExpenses` (object), `monthlyExpectedExpenses` (object), `profilePicture` (file upload) |
| **DELETE**      | `/api/v1/users/:id`        | Delete a user by ID.                                              | Yes           | Requires: Authenticated user must match the ID. |

---

## **Transaction** 💳

| **HTTP Method** | **Endpoint**               | **Description**                                                   | **Protected** | **Data Fields** |
|-----------------|----------------------------|-------------------------------------------------------------------|---------------|-----------------|
| **GET**         | `/api/v1/transactions`     | Fetch all transactions for the authenticated user.                | Yes           | Returns: `type` (`Income`/`Expense`), `name`, `amount`, `date`, `category` (for expenses), `user` |
| **POST**        | `/api/v1/transactions`     | Add a new transaction.                                            | Yes           | Requires: `type`, `name`, `amount`, `date` *(optional)*, `category` *(required if Expense)* |
| **PUT**         | `/api/v1/transactions/:id` | Edit a transaction by ID.                                         | Yes           | Accepts: `type`, `name`, `amount`, `date`, `category` |
| **DELETE**      | `/api/v1/transactions/:id` | Delete a transaction by ID.                                       | Yes           | Requires: Transaction ID in URL. |

---

## **Goal** 🎯

| **HTTP Method** | **Endpoint**               | **Description**                                                   | **Protected** | **Data Fields** |
|-----------------|----------------------------|-------------------------------------------------------------------|---------------|-----------------|
| **GET**         | `/api/v1/goals`            | Fetch all goals for the authenticated user.                       | Yes           | Returns: `goalName`, `targetAmount`, `completionDate`, `monthlyContribution`, `user` |
| **POST**        | `/api/v1/goals`            | Create a new financial goal.                                      | Yes           | Requires: `goalName`, `targetAmount`, `completionDate` *(optional)*, `monthlyContribution` *(optional)* |
| **PUT**         | `/api/v1/goals/:id`        | Edit a goal by ID.                                                 | Yes           | Accepts: `goalName`, `targetAmount`, `completionDate`, `monthlyContribution` |
| **DELETE**      | `/api/v1/goals/:id`        | Delete a goal by ID.                                              | Yes           | Requires: Goal ID in URL. |

### Authentication 🔑

- All routes except registration and login require a valid JWT token in the `Authorization` header (as a Bearer token).
- Example:

  ```bash
  Authorization: Bearer <your-jwt-token>
  ```

### Error Handling 🚨

- All endpoints return a status code and a message. Common error codes include:
  - `400 Bad Request`: Invalid or missing data.
  - `404 Not Found`: Resource not found.
  - `500 Internal Server Error`: Server-side issues.

### Deployment 🚀

This backend is deployed and running on [Vercel](https://backend-savings-app.vercel.app/).

### Development 🛠️

For development, use tools like Insomnia to test API requests. Ensure MongoDB is running and connected.

