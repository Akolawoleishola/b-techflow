const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../src/app");
const products = require("../src/data/productStore");

async function startServer() {
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  return server;
}

function getBaseUrl(server) {
  const { port } = server.address();
  return `http://127.0.0.1:${port}`;
}

test.beforeEach(() => {
  products.length = 0;
});

test("GET / returns the welcome message", async () => {
  const server = await startServer();

  try {
    const response = await fetch(`${getBaseUrl(server)}/`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.message, "B-Techflow API is running.");
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test("Unknown routes return a 404 JSON response", async () => {
  const server = await startServer();

  try {
    const response = await fetch(`${getBaseUrl(server)}/unknown-route`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.success, false);
    assert.match(body.message, /Route not found/i);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test("GET /api/products returns an empty array when no products exist", async () => {
  const server = await startServer();

  try {
    const response = await fetch(`${getBaseUrl(server)}/api/products`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body.products, []);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test("A valid product creates successfully and returns the created product", async () => {
  const server = await startServer();

  try {
    const response = await fetch(`${getBaseUrl(server)}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Wireless Mouse",
        description: "A wireless computer mouse",
        price: 25.99,
        quantity: 20,
        category: "Electronics",
      }),
    });

    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.equal(body.message, "Product created successfully.");
    assert.ok(body.product.id);
    assert.equal(body.product.name, "Wireless Mouse");
    assert.equal(body.product.description, "A wireless computer mouse");
    assert.equal(body.product.price, 25.99);
    assert.equal(body.product.quantity, 20);
    assert.equal(body.product.category, "Electronics");
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test("Product creation rejects invalid input values", async () => {
  const server = await startServer();
  const invalidCases = [
    { name: "Missing fields", payload: { name: "Mouse" }, expectedStatus: 400 },
    { name: "Empty name", payload: { name: "   ", description: "Desc", price: 20, quantity: 2, category: "Office" }, expectedStatus: 400 },
    { name: "Empty description", payload: { name: "Mouse", description: "   ", price: 20, quantity: 2, category: "Office" }, expectedStatus: 400 },
    { name: "Empty category", payload: { name: "Mouse", description: "Desc", price: 20, quantity: 2, category: "   " }, expectedStatus: 400 },
    { name: "Negative price", payload: { name: "Mouse", description: "Desc", price: -1, quantity: 2, category: "Office" }, expectedStatus: 400 },
    { name: "Nonnumeric price", payload: { name: "Mouse", description: "Desc", price: "25.99", quantity: 2, category: "Office" }, expectedStatus: 400 },
    { name: "Infinite price", payload: { name: "Mouse", description: "Desc", price: Number.POSITIVE_INFINITY, quantity: 2, category: "Office" }, expectedStatus: 400 },
    { name: "Negative quantity", payload: { name: "Mouse", description: "Desc", price: 20, quantity: -1, category: "Office" }, expectedStatus: 400 },
    { name: "Decimal quantity", payload: { name: "Mouse", description: "Desc", price: 20, quantity: 2.5, category: "Office" }, expectedStatus: 400 },
    { name: "Nonnumeric quantity", payload: { name: "Mouse", description: "Desc", price: 20, quantity: "2", category: "Office" }, expectedStatus: 400 },
    { name: "Null value", payload: { name: "Mouse", description: "Desc", price: null, quantity: 2, category: "Office" }, expectedStatus: 400 },
    { name: "Invalid type", payload: { name: 123, description: "Desc", price: 20, quantity: 2, category: "Office" }, expectedStatus: 400 },
    { name: "Unexpected field", payload: { name: "Mouse", description: "Desc", price: 20, quantity: 2, category: "Office", id: "bad" }, expectedStatus: 400 },
  ];

  try {
    for (const testCase of invalidCases) {
      const response = await fetch(`${getBaseUrl(server)}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testCase.payload),
      });
      const body = await response.json();

      assert.equal(response.status, testCase.expectedStatus, `${testCase.name} status should match`);
      assert.equal(body.success, false);
      assert.ok(body.message);
    }
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test("GET /api/products/:id returns a single product and 404 for unknown IDs", async () => {
  const server = await startServer();

  try {
    const createResponse = await fetch(`${getBaseUrl(server)}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Keyboard",
        description: "Mechanical keyboard",
        price: 45,
        quantity: 8,
        category: "Accessories",
      }),
    });

    const createdProduct = await createResponse.json();
    const productId = createdProduct.product.id;

    const getResponse = await fetch(`${getBaseUrl(server)}/api/products/${productId}`);
    const getBody = await getResponse.json();

    assert.equal(getResponse.status, 200);
    assert.equal(getBody.product.id, productId);
    assert.equal(getBody.product.name, "Keyboard");

    const missingResponse = await fetch(`${getBaseUrl(server)}/api/products/does-not-exist`);
    const missingBody = await missingResponse.json();

    assert.equal(missingResponse.status, 404);
    assert.equal(missingBody.success, false);
    assert.match(missingBody.message, /not found/i);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test("PUT /api/products/:id validates and updates product fields correctly", async () => {
  const server = await startServer();

  try {
    const createResponse = await fetch(`${getBaseUrl(server)}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Monitor",
        description: "4K monitor",
        price: 300,
        quantity: 7,
        category: "Display",
      }),
    });

    const created = await createResponse.json();
    const productId = created.product.id;

    const updateResponse = await fetch(`${getBaseUrl(server)}/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Gaming Monitor",
        price: 420,
      }),
    });

    const updated = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updated.product.name, "Gaming Monitor");
    assert.equal(updated.product.description, "4K monitor");
    assert.equal(updated.product.price, 420);
    assert.equal(updated.product.quantity, 7);
    assert.equal(updated.product.category, "Display");

    const emptyUpdateResponse = await fetch(`${getBaseUrl(server)}/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const emptyUpdateBody = await emptyUpdateResponse.json();

    assert.equal(emptyUpdateResponse.status, 400);
    assert.equal(emptyUpdateBody.success, false);

    const invalidPriceResponse = await fetch(`${getBaseUrl(server)}/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: -10 }),
    });
    const invalidPriceBody = await invalidPriceResponse.json();

    assert.equal(invalidPriceResponse.status, 400);
    assert.equal(invalidPriceBody.success, false);

    const rejectIdResponse = await fetch(`${getBaseUrl(server)}/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "hack-id", name: "Changed" }),
    });
    const rejectIdBody = await rejectIdResponse.json();

    assert.equal(rejectIdResponse.status, 400);
    assert.equal(rejectIdBody.message, "Product ID cannot be changed.");

    const missingProductResponse = await fetch(`${getBaseUrl(server)}/api/products/missing-id`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "No Product" }),
    });
    const missingProductBody = await missingProductResponse.json();

    assert.equal(missingProductResponse.status, 404);
    assert.equal(missingProductBody.success, false);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test("DELETE /api/products/:id removes a product and returns 404 for missing IDs", async () => {
  const server = await startServer();

  try {
    const createResponse = await fetch(`${getBaseUrl(server)}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Laptop",
        description: "Gaming laptop",
        price: 1200,
        quantity: 5,
        category: "Computers",
      }),
    });

    const created = await createResponse.json();
    const productId = created.product.id;

    const deleteResponse = await fetch(`${getBaseUrl(server)}/api/products/${productId}`, { method: "DELETE" });
    const deleteBody = await deleteResponse.json();

    assert.equal(deleteResponse.status, 200);
    assert.equal(deleteBody.success, true);
    assert.equal(deleteBody.message, "Product deleted successfully.");

    const getAfterDelete = await fetch(`${getBaseUrl(server)}/api/products/${productId}`);
    assert.equal(getAfterDelete.status, 404);

    const deleteMissingResponse = await fetch(`${getBaseUrl(server)}/api/products/nope`, { method: "DELETE" });
    const deleteMissingBody = await deleteMissingResponse.json();

    assert.equal(deleteMissingResponse.status, 404);
    assert.equal(deleteMissingBody.success, false);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test("Malformed JSON results in a controlled 400 response", async () => {
  const server = await startServer();

  try {
    const response = await fetch(`${getBaseUrl(server)}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{bad json}",
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.match(body.message, /Malformed JSON|JSON/i);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});
