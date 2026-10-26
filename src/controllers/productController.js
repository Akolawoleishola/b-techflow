const crypto = require("crypto");
const products = require("../data/productStore");

function createProduct(req, res) {
  const { name, description, price, quantity, category } = req.body;

  const newProduct = {
    id: crypto.randomUUID(),
    name,
    description,
    price,
    quantity,
    category,
  };

  products.push(newProduct);

  return res.status(201).json({
    success: true,
    message: "Product created successfully.",
    product: newProduct,
  });
}

function getAllProducts(req, res) {
  return res.status(200).json({
    success: true,
    products,
  });
}

function getProductById(req, res) {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  return res.status(200).json({
    success: true,
    product,
  });
}

function updateProduct(req, res) {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  Object.entries(req.body).forEach(([field, value]) => {
    product[field] = value;
  });

  return res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    product,
  });
}

function deleteProduct(req, res) {
  const productIndex = products.findIndex((item) => item.id === req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  const [deletedProduct] = products.splice(productIndex, 1);

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
    deletedProduct,
  });
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
