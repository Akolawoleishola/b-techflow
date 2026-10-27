# B-Techflow Product Inventory API

## About the Project

The B-Techflow Product Inventory API is a backend project developed as part of a group assignment in the Be-Techified program.

The project focuses on building a REST API for managing product inventory. It allows clients to create new products, retrieve product information, update existing products, and delete products.

The API also includes input validation and error handling to help ensure that requests are processed correctly.

## Project Objectives

The main objectives of this project are to:

- Build a REST API using Node.js and Express.js.
- Implement the four CRUD operations: Create, Read, Update, and Delete.
- Validate incoming product data.
- Handle invalid requests and missing resources appropriately.
- Test API endpoints using Postman and automated tests.
- Organize the application into separate routes, controllers, and middleware.

## Technologies Used

- **Node.js** — Runs the JavaScript application on the server.
- **Express.js** — Handles HTTP requests, routes, and API responses.
- **Nodemon** — Restarts the server automatically during development.
- **Postman** — Used to send requests and test API endpoints.
- **Node.js Test Runner** — Used to run automated tests.
- **Git and GitHub** — Used for version control and source code management.

## Features

- Create a product.
- Retrieve all products.
- Retrieve a single product by its ID.
- Update an existing product.
- Delete a product.
- Generate a unique ID for each product.
- Validate product information before processing requests.
- Handle errors, invalid data, and requests for products that do not exist.
- Run automated tests to check API behavior.

## Project Structure

```text
B-Techflow/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   │   └── productController.js
│   ├── data/
│   │   └── productStore.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validateProduct.js
│   └── routes/
│       └── productRoutes.js
├── test/
│   └── product.test.js
├── package.json
├── package-lock.json
└── README.md
```

### Main Files

- `app.js` configures the Express application and registers the routes.
- `server.js` starts the server.
- `productRoutes.js` defines the product API endpoints.
- `productController.js` contains the logic for managing products.
- `productStore.js` holds the product data in memory.
- `validateProduct.js` validates incoming product information.
- `errorHandler.js` handles errors and returns appropriate responses.
- `product.test.js` contains automated tests for the API.

## Getting Started

### Prerequisites

Before running the project, make sure you have installed:

- Node.js
- npm
- Postman (for manual API testing)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Akolawoleishola/b-techflow.git
```

**2. Navigate into the project directory**

```bash
cd b-techflow
```

**3. Install the dependencies**

```bash
npm install
```

### Running the Application

To start the server normally, run:

```bash
npm start
```

For development, you can run:

```bash
npm run dev
```

The server runs on port `3000` by default.

Once the server is running, open:

```text
http://localhost:3000
```

The API's product endpoints are available under:

```text
http://localhost:3000/api/products
```

## API Endpoints

All product endpoints use the `/api/products` base path.

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Checks whether the API is running |
| GET | `/api/products` | Retrieves all products |
| GET | `/api/products/:id` | Retrieves a product by ID |
| POST | `/api/products` | Creates a new product |
| PUT | `/api/products/:id` | Updates an existing product |
| DELETE | `/api/products/:id` | Deletes a product |

### Example Product

A product can contain the following fields:

```json
{
  "name": "Wireless Mouse",
  "description": "A wireless mouse for office use",
  "category": "Electronics",
  "price": 15.99,
  "quantity": 20
}
```

The API generates the product ID automatically when a product is created.

### Creating a Product

Send a `POST` request to:

```text
http://localhost:3000/api/products
```

In Postman, select **Body → raw → JSON**, enter the product data, and send the request.

### Retrieving Products

To retrieve all products, send a `GET` request to:

```text
http://localhost:3000/api/products
```

To retrieve one product, use:

```text
http://localhost:3000/api/products/PRODUCT_ID
```

Replace `PRODUCT_ID` with the actual ID returned when the product was created.

### Updating a Product

Send a `PUT` request to:

```text
http://localhost:3000/api/products/PRODUCT_ID
```

For example, the following JSON updates the product's price and quantity:

```json
{
  "price": 18.5,
  "quantity": 15
}
```

### Deleting a Product

Send a `DELETE` request to:

```text
http://localhost:3000/api/products/PRODUCT_ID
```

Replace `PRODUCT_ID` with the ID of the product you want to delete.

## Input Validation and Error Handling

The API validates incoming product data to help prevent invalid information from being accepted.

The implemented validation includes:

- Checking that required product fields contain valid values.
- Rejecting empty product names, descriptions, and categories.
- Ensuring that prices are valid, finite, non-negative numbers.
- Ensuring that quantities are non-negative integers.
- Rejecting empty update requests and unsupported fields.
- Preventing attempts to change a product's ID through an update request.

The application also handles malformed JSON, unknown routes, and requests for products that do not exist.

## Testing

The API can be tested manually using Postman and automatically using the Node.js test runner.

### Running Automated Tests

From the project directory, run:

```bash
npm test
```

The automated tests cover important API behavior, including product creation, retrieval, updating, deletion, validation, and error responses.

The test run completed during development reported **9 tests passed and 0 failed**.

Run the command again whenever you want to verify the current state of the application.

## Current Limitation

The current version stores products in an in-memory array rather than a database.

This means that product data is lost when the server restarts. The data is intended for demonstrating and testing the API's functionality.

## Possible Future Improvements

Future versions could include:

- Integration with a database such as MongoDB or PostgreSQL.
- User authentication and authorization.
- Product search and category filtering.
- Pagination for large product collections.
- Additional automated tests.
- Online deployment.

These are possible future improvements rather than features currently included in the project.

## Repository

The source code is available on GitHub:

https://github.com/Akolawoleishola/b-techflow

## Conclusion

The B-Techflow Product Inventory API demonstrates how a backend application can manage product information through RESTful endpoints.

Through this project, I have had the opportunity to work with API development concepts, CRUD operations, request validation, error handling, and testing. The project also provides a foundation for further improvements, including database integration and deployment.