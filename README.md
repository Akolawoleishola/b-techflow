# B-Techflow Product Inventory API

A RESTful backend API built with Node.js and Express.js for managing product inventory. The API supports creating, retrieving, updating, and deleting products, with input validation, centralized error handling, and automated tests.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the API](#running-the-api)
- [API Endpoints](#api-endpoints)
- [Product Data Format](#product-data-format)
- [Validation Rules](#validation-rules)
- [Error Handling](#error-handling)
- [Running Tests](#running-tests)
- [Current Limitations](#current-limitations)
- [Future Improvements](#future-improvements)

## Project Overview

B-Techflow Product Inventory API is a backend application designed to manage product inventory through HTTP requests.

It allows clients such as Postman or a frontend application to create products, retrieve product information, update existing products, and delete products.

The project demonstrates REST API development, Express.js routing, controller organization, request validation, error handling, and automated testing.

**Project type:** Backend API  
**Runtime:** Node.js  
**Framework:** Express.js  
**Default port:** 3000  
**Data storage:** In-memory storage

## Features

- Create new products.
- Retrieve all products.
- Retrieve an individual product by ID.
- Update existing product information.
- Delete products.
- Generate unique product IDs automatically.
- Validate product data before processing requests.
- Handle invalid requests and missing resources.
- Return structured JSON responses.
- Run automated tests using Node.js's built-in test runner.

## Technologies Used

- **Node.js** — JavaScript runtime.
- **Express.js** — Web framework for building the REST API.
- **Nodemon** — Automatically restarts the server during development.
- **Node.js Test Runner** — Runs automated API tests.
- **Postman** — Manually tests API endpoints.

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
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### Directory Responsibilities

| File or Directory | Responsibility |
|---|---|
| `src/server.js` | Starts the API server. |
| `src/app.js` | Configures the Express application and middleware. |
| `src/routes/productRoutes.js` | Defines product API endpoints. |
| `src/controllers/productController.js` | Implements product CRUD operations. |
| `src/data/productStore.js` | Stores products in memory. |
| `src/middleware/validateProduct.js` | Validates product input. |
| `src/middleware/errorHandler.js` | Handles application errors. |
| `test/product.test.js` | Contains automated API tests. |
| `package.json` | Defines project metadata, dependencies, and scripts. |

## Requirements

Before installing the project, ensure you have:

- [Node.js](https://nodejs.org/) installed.
- npm, which is included with Node.js.
- [Git](https://git-scm.com/) for cloning the repository.
- [Postman](https://www.postman.com/) for manual API testing.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Akolawoleishola/b-techflow.git
```

### 2. Navigate to the project directory

```bash
cd b-techflow
```

### 3. Install dependencies

```bash
npm install
```

## Running the API

### Start the server

```bash
npm start
```

The API should start on port `3000`, unless a different port is provided through the environment.

Expected terminal output:

```text
B-Techflow API is running on port 3000
```

### Development mode

To run the server with automatic restarts during development, use:

```bash
npm run dev
```

### Base URL

When running locally, the base URL is:

```text
http://localhost:3000
```

## API Endpoints

All product endpoints use the `/api/products` base path.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Checks whether the API is running. |
| GET | `/api/products` | Retrieves all products. |
| GET | `/api/products/:id` | Retrieves a product by ID. |
| POST | `/api/products` | Creates a new product. |
| PUT | `/api/products/:id` | Updates an existing product. |
| DELETE | `/api/products/:id` | Deletes a product. |

### 1. Check API Status

**Request**

```http
GET /
```

Example URL:

```text
http://localhost:3000/
```

Returns a JSON message confirming that the API is running.

### 2. Retrieve All Products

**Request**

```http
GET /api/products
```

Example URL:

```text
http://localhost:3000/api/products
```

Retrieves the products currently stored in memory.

### 3. Retrieve a Product by ID

**Request**

```http
GET /api/products/:id
```

Example:

```text
http://localhost:3000/api/products/PRODUCT_ID
```

Replace `PRODUCT_ID` with the actual ID returned when a product is created.

If the requested product does not exist, the API returns a `404 Not Found` response.

### 4. Create a Product

**Request**

```http
POST /api/products
```

Set the request body to JSON.

Example:

```json
{
  "name": "Wireless Mouse",
  "description": "A wireless mouse for office use",
  "category": "Electronics",
  "price": 15.99,
  "quantity": 20
}
```

The API validates the submitted data and generates a unique ID for the new product.

### 5. Update a Product

**Request**

```http
PUT /api/products/:id
```

Example:

```text
http://localhost:3000/api/products/PRODUCT_ID
```

Example request body:

```json
{
  "price": 18.5,
  "quantity": 15
}
```

The API supports partial updates. You can update specific product fields without resending every field.

The product ID cannot be changed through an update request.

### 6. Delete a Product

**Request**

```http
DELETE /api/products/:id
```

Example:

```text
http://localhost:3000/api/products/PRODUCT_ID
```

Replace `PRODUCT_ID` with the actual product ID.

The API removes the specified product from the in-memory collection. Requests to retrieve that product afterward should return `404 Not Found`.

## Product Data Format

A product contains the following fields:

| Field | Type | Description |
|---|---|---|
| `id` | String | Automatically generated unique identifier. |
| `name` | String | Product name. |
| `description` | String | Description of the product. |
| `category` | String | Product category. |
| `price` | Number | Product price. |
| `quantity` | Integer | Number of units available. |

The `id` is generated by the API and should not be supplied or changed by the client.

## Validation Rules

The API validates product input before processing it.

- Product names must not be empty.
- Product descriptions must not be empty.
- Product categories must not be empty.
- Prices must be finite, non-negative numbers.
- Quantities must be non-negative integers.
- String fields are trimmed to remove surrounding whitespace.
- Update requests must contain valid fields and cannot change the product ID.
- Empty update requests are rejected.
- Unknown product fields are rejected.

Invalid input results in a controlled error response rather than a successful product operation.

## Error Handling

The API uses centralized error-handling middleware to return controlled JSON error responses.

Common HTTP status codes include:

| Status Code | Meaning |
|---|---|
| `200 OK` | The request succeeded. |
| `201 Created` | A resource was created, where applicable. |
| `400 Bad Request` | The request contains invalid data or malformed JSON. |
| `404 Not Found` | The requested product or route does not exist. |
| `500 Internal Server Error` | An unexpected server error occurred. |

The exact success status code depends on the operation's implementation.

## Running Tests

The project includes automated tests for its main API operations and error-handling behavior.

Run the tests with:

```bash
npm test
```

The test suite covers scenarios including:

- API welcome endpoint.
- Unknown routes.
- Retrieving products.
- Creating valid products.
- Rejecting invalid product data.
- Retrieving individual products.
- Updating products.
- Deleting products.
- Handling malformed JSON.

The current test suite has previously completed successfully with **9 tests passed and 0 failed**.

Run the command again whenever you change the application to verify that the tests still pass.

## Current Limitations

### In-memory storage

The application currently stores products in memory rather than in a persistent database.

Consequently:

- Product data is lost when the server restarts.
- Data is not shared between separate server instances.
- The current implementation is suitable for demonstrating API functionality, but it is not yet a persistent inventory management solution.

### No frontend

This project provides a backend API only. Clients such as Postman can communicate with it using HTTP requests.

A graphical user interface is outside the current project scope.

## Future Improvements

Potential improvements include:

- Integrating a database such as MongoDB or PostgreSQL.
- Adding persistent product storage.
- Implementing authentication and authorization if required.
- Adding pagination and product search.
- Supporting product filtering by category.
- Deploying the API to a hosting platform.
- Expanding automated test coverage.

These are possible future enhancements and are not claims about existing functionality.

## Author and Repository

**Project:** B-Techflow Product Inventory API

**GitHub Repository:**  
https://github.com/Akolawoleishola/b-techflow

## License

No license has been specified for this project. Add a license if required by the project owner or assignment.