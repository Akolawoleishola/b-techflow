const allowedProductFields = new Set(["name", "description", "price", "quantity", "category"]);
const requiredCreateFields = ["name", "description", "price", "quantity", "category"];

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.name = "ValidationError";
  return error;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sanitizeBody(body) {
  const sanitizedBody = { ...body };

  ["name", "description", "category"].forEach((field) => {
    if (typeof sanitizedBody[field] === "string") {
      sanitizedBody[field] = sanitizedBody[field].trim();
    }
  });

  return sanitizedBody;
}

function validateStringField(fieldName, value, { allowEmpty = false } = {}) {
  if (typeof value !== "string") {
    return `${fieldName} must be a string.`;
  }

  if (!allowEmpty && value.trim() === "") {
    return `${fieldName} cannot be empty.`;
  }

  return null;
}

function validatePrice(value) {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value) || value < 0) {
    return "price must be a valid nonnegative number.";
  }

  return null;
}

function validateQuantity(value) {
  if (!Number.isInteger(value) || value < 0) {
    return "quantity must be a nonnegative integer.";
  }

  return null;
}

function validateProductRequest(req, res, next, { requireAllFields = true }) {
  if (!isPlainObject(req.body)) {
    return next(createValidationError("Request body must be a JSON object."));
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "id")) {
    return next(createValidationError("Product ID cannot be changed."));
  }

  const unexpectedFields = Object.keys(req.body).filter((field) => !allowedProductFields.has(field));
  if (unexpectedFields.length > 0) {
    return next(createValidationError(`Unexpected field(s): ${unexpectedFields.join(", ")}.`));
  }

  const sanitizedBody = sanitizeBody(req.body);
  req.body = sanitizedBody;

  if (requireAllFields) {
    for (const field of requiredCreateFields) {
      if (!Object.prototype.hasOwnProperty.call(req.body, field) || req.body[field] === null || req.body[field] === undefined) {
        return next(createValidationError(`Missing required field: ${field}.`));
      }
    }
  }

  if (Object.keys(req.body).length === 0) {
    return next(createValidationError("Update payload cannot be empty."));
  }

  const fieldChecks = {
    name: (value) => validateStringField("name", value),
    description: (value) => validateStringField("description", value),
    category: (value) => validateStringField("category", value),
    price: (value) => validatePrice(value),
    quantity: (value) => validateQuantity(value),
  };

  for (const [field, check] of Object.entries(fieldChecks)) {
    if (!Object.prototype.hasOwnProperty.call(req.body, field)) {
      continue;
    }

    const message = check(req.body[field]);
    if (message) {
      return next(createValidationError(message));
    }
  }

  if (requireAllFields) {
    for (const field of requiredCreateFields) {
      if (field === "name" || field === "description" || field === "category") {
        const message = validateStringField(field, req.body[field]);
        if (message) {
          return next(createValidationError(message));
        }
      }
    }
  }

  return next();
}

function validateProductCreate(req, res, next) {
  return validateProductRequest(req, res, next, { requireAllFields: true });
}

function validateProductUpdate(req, res, next) {
  if (Object.keys(req.body || {}).length === 0) {
    return next(createValidationError("Update payload cannot be empty."));
  }

  return validateProductRequest(req, res, next, { requireAllFields: false });
}

module.exports = {
  validateProductCreate,
  validateProductUpdate,
};
