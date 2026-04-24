# Savings App Backend 💸

This is the backend for the **Savings App**, a personal finance application designed to track users' income, expenses, and goals. The app helps users manage their finances by allowing them to set financial goals, track transactions, and view summaries of their monthly income and expenses. 📊💰

## Features 🌟

- **User Authentication** 🔐: Users can register, log in, and manage their profiles.
- **Transaction Management** 🧾: Users can track their income and expenses, with categorization for better financial management.
- **Bulk Transaction Import** 📂: Users can import multiple transactions at once by uploading an `.xlsx` Excel file.
- **Goal Management** 🎯: Users can set financial goals, specify target amounts, track progress with current allocated amounts, and manage goal allocations.
- **Automatic Goal Calculations** 🧮: The system auto-calculates the completion date or monthly contribution based on provided data, and computes the user's age at goal completion.
- **Profile Pictures** 🖼️: Users can upload a profile picture, stored in Cloudinary.
- **Budget Tracking** 📊: Monthly expected vs. actual expenses tracked across 13 categories with automatic totals.

## Technologies Used ⚙️

- **Node.js**: Backend runtime environment.
- **Express** v5: Web framework for Node.js.
- **MongoDB**: Database to store user data, transactions, and goals.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **JWT (JSON Web Token)**: For user authentication and authorization.
- **bcryptjs**: Password hashing and comparison.
- **Cloudinary**: Cloud storage for profile picture uploads.
- **Multer**: Middleware for handling multipart/form-data file uploads (images and Excel files).
- **xlsx**: Library for parsing Excel files used in bulk transaction imports.
- **dotenv**: Environment variable management.
- **cors**: Cross-origin request handling.

# 📌 Available Routes

## **User** 👤

| **HTTP Method** | **Endpoint**             | **Description**                                                | **Protected** | **Data Fields**                                                                                                                                                                               |
| --------------- | ------------------------ | -------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GET**         | `/api/v1/users`          | Fetch all users.                                               | No            | Returns: `name`, `birthDate`, `email`, `profilePicture`, `monthlySalary`, `monthlyExpenses`, `totalExpenses`, `monthlyExpectedExpenses`, `totalExpectedExpenses`, `transactions[]`, `goals[]` |
| **GET**         | `/api/v1/users/:id`      | Fetch a specific user by ID, including transactions and goals. | Yes           | Same as above, but only for the specified user.                                                                                                                                               |
| **POST**        | `/api/v1/users/register` | Register a new user.                                           | No            | Requires: `name`, `birthDate`, `email`, `password`, `repeatPassword`                                                                                                                          |
| **POST**        | `/api/v1/users/login`    | User login, returns JWT token.                                 | No            | Requires: `email`, `password`<br>Returns: `user` object, `token`                                                                                                                              |
| **PUT**         | `/api/v1/users/:id`      | Update user details.                                           | Yes           | Accepts: `name`, `birthDate`, `monthlySalary`, `monthlyExpenses` (object), `monthlyExpectedExpenses` (object), `profilePicture` (file upload)                                                 |
| **DELETE**      | `/api/v1/users/:id`      | Delete a user by ID.                                           | Yes           | Requires: Authenticated user must match the ID.                                                                                                                                               |

---

## **Transaction** 💳

| **HTTP Method** | **Endpoint**                | **Description**                                                   | **Protected** | **Data Fields**                                                                                                                                       |
| --------------- | --------------------------- | ----------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GET**         | `/api/v1/transactions`      | Fetch all transactions for the authenticated user.                | Yes           | Returns: `type` (`Income`/`Expense`), `name`, `amount`, `date`, `category` (for expenses), `user`                                                     |
| **POST**        | `/api/v1/transactions`      | Add a new transaction.                                            | Yes           | Requires: `type`, `name`, `amount`, `date`, `category` _(required if Expense)_                                                                        |
| **POST**        | `/api/v1/transactions/bulk` | Import multiple transactions from an Excel file (`.xlsx`/`.xls`). | Yes           | Requires: multipart form-data with a `file` field containing the Excel file. Returns: count of created transactions and an array of row-level errors. |
| **PUT**         | `/api/v1/transactions/:id`  | Edit a transaction by ID.                                         | Yes           | Accepts: `type`, `name`, `amount`, `date`, `category`                                                                                                 |
| **DELETE**      | `/api/v1/transactions/:id`  | Delete a transaction by ID.                                       | Yes           | Requires: Transaction ID in URL.                                                                                                                      |

---

## **Goal** 🎯

| **HTTP Method** | **Endpoint**        | **Description**                             | **Protected** | **Data Fields**                                                                                                                                |
| --------------- | ------------------- | ------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **GET**         | `/api/v1/goals`     | Fetch all goals for the authenticated user. | Yes           | Returns: `goalName`, `targetAmount`, `completionDate`, `monthlyContribution`, `currentAmount`, `user`                                          |
| **POST**        | `/api/v1/goals`     | Create a new financial goal.                | Yes           | Requires: `goalName`, `targetAmount`, `completionDate` _(optional)_, `monthlyContribution` _(optional)_<br>Note: `currentAmount` defaults to 0 |
| **PUT**         | `/api/v1/goals/:id` | Edit a goal by ID.                          | Yes           | Accepts: `goalName`, `targetAmount`, `completionDate`, `monthlyContribution`, `currentAmount`                                                  |
| **DELETE**      | `/api/v1/goals/:id` | Delete a goal by ID.                        | Yes           | Requires: Goal ID in URL.                                                                                                                      |

### Goal Management Features 🎯

- **Current Amount Tracking**: Each goal tracks how much money has been allocated to it via the `currentAmount` field.
- **Progress Calculation**: Progress is calculated as `(currentAmount / targetAmount) * 100`.
- **Goal Allocation Management**: Users can add or remove money from goals through the frontend interface.
- **Automatic Calculations**: The system automatically calculates the completion date or monthly contribution based on whichever value is provided.
- **Age at Completion**: The system calculates the user's age at the time of goal completion (`ageAtGoalCompletion`).

### Bulk Transaction Import 📂

Users can import multiple transactions at once by uploading an Excel file to `POST /api/v1/transactions/bulk`.

**Excel file requirements:**

- Format: `.xlsx` or `.xls`
- The file must contain a header row with these columns (detected dynamically): `Transaction Type`, `Title`, `Amount`, `Date`, `Category`
- `Transaction Type` must be `Income` or `Expense`
- `Amount` supports values with `$`, commas, and spaces (e.g., `$1,200.00`)
- `Date` must be a valid date (YYYY-MM-DD or a Date object)
- `Category` is required for `Expense` rows and must be one of the valid categories listed below

The response includes the count of successfully created transactions and an array of errors for invalid rows.

### Transaction Categories 🗂️

Valid categories for `Expense` transactions:

`Home` · `Groceries` · `Dining & Drinks` · `Transport` · `Lifestyle` · `Entertainment` · `Health & Fitness` · `Travel` · `Debt` · `Other`

### User Expense Categories 📊

Monthly expenses (`monthlyExpenses` and `monthlyExpectedExpenses`) are tracked across **13 categories**:

🏠 Home · 🚗 Transportation · 🛒 Groceries · 🏥 Health · 🎭 Entertainment · ✈️ Travel · 💳 Subscriptions · 🛍️ Shopping · 📚 Education · 🎁 Gifts · 🏦 Debt · 🍸 Leisure · ❓ Other

Both `totalExpenses` and `totalExpectedExpenses` are automatically calculated as the sum of their respective category values.

### Authentication 🔑

- All routes except registration and login require a valid JWT token in the `Authorization` header (as a Bearer token).
- Tokens are valid for **1 year**.
- Example:

  ```bash
  Authorization: Bearer <your-jwt-token>
  ```

### Error Handling 🚨

- All endpoints return a status code and a message. Common error codes include:
  - `400 Bad Request`: Invalid or missing data.
  - `401 Unauthorized`: Missing or invalid JWT token.
  - `404 Not Found`: Resource not found.
  - `500 Internal Server Error`: Server-side issues.

### Data Validation 📋

- **Goals**: `targetAmount` must be greater than 0, `currentAmount` cannot be negative, completion dates must be in the future. At least one of `completionDate` or `monthlyContribution` must be provided.
- **Transactions**: `amount` must be positive, `type` must be either "Income" or "Expense", `category` is required for Expense type.
- **Users**: Email must be valid and unique, password minimum 8 characters, `birthDate` must be in the past.

### Environment Variables 🔐

Create a `.env` file at the project root with the following variables:

```env
DB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Deployment 🚀

This backend is deployed and running on [Vercel](https://backend-savings-app.vercel.app/).

### Development 🛠️

For development, use tools like Insomnia or Postman to test API requests. Ensure MongoDB is running and connected.
