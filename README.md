
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


### Available Routes 🚪

#### **User** 👤
| **HTTP Method** | **Endpoint**               | **Description**                                                   | **Protected** |
|-----------------|----------------------------|-------------------------------------------------------------------|---------------|
| GET             | `/api/v1/users`            | Fetch all users.                                                  | No            |
| POST            | `/api/v1/register`         | Register a new user.                                              | No            |
| POST            | `/api/v1/login`            | User login, returns JWT token for authentication.                 | No            |
| PUT             | `/api/v1/users/:id`        | Update user details (name, birth date, salary, expenses, etc.).   | Yes           |
| DELETE          | `/api/v1/users/:id`        | Delete a user by their ID.                                        | Yes           |

#### **Transaction** 💳
| **HTTP Method** | **Endpoint**               | **Description**                                                   | **Protected** |
|-----------------|----------------------------|-------------------------------------------------------------------|---------------|
| GET             | `/api/v1/transactions`     | Fetch all transactions.                                           | Yes           |
| POST            | `/api/v1/transactions`     | Add a new transaction (Income or Expense).                        | Yes           |
| DELETE          | `/api/v1/transactions/:id` | Delete a transaction by its ID.                                   | Yes           |
| PUT             | `/api/v1/transactions/:id` | Edit a specific transaction by ID.                                | Yes           |

#### **Goal** 🎯
| **HTTP Method** | **Endpoint**               | **Description**                                                   | **Protected** |
|-----------------|----------------------------|-------------------------------------------------------------------|---------------|
| GET             | `/api/v1/goals`            | Fetch all goals for the logged-in user.                           | Yes           |
| POST            | `/api/v1/goals`            | Create a new financial goal (target amount, contributions, etc.). | Yes           |
| PUT             | `/api/v1/goals/:id`        | Edit an existing financial goal by ID.                            | Yes           |
| DELETE          | `/api/v1/goals/:id`        | Delete a goal by its ID.                                          | Yes           |

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

