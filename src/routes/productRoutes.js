const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { validateProductCreate, validateProductUpdate } = require("../middleware/validateProduct");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", validateProductCreate, createProduct);
router.put("/:id", validateProductUpdate, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
