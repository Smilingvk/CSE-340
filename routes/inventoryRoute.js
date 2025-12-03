const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const classValidate = require("../utilities/inventory-validation");

// Management view (requires Employee or Admin)
router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
);

// Add classification routes (requires Employee or Admin)
router.get(
  "/add-classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);
router.post(
  "/add-classification",
  utilities.checkAccountType,
  classValidate.classificationRules(),
  classValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
);

// Add inventory routes (requires Employee or Admin)
router.get(
  "/add-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);
router.post(
  "/add-inventory",
  utilities.checkAccountType,
  classValidate.inventoryRules(),
  classValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to build inventory by classification view (public)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view (public)
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

module.exports = router;