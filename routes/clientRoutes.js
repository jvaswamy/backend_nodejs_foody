const express = require("express");
const clientController = require("../controllers/clientController");

const router = express.Router();

router.post("/register", clientController.registerClient);
router.post("/login", clientController.loginClient);
router.get("/all-clients", clientController.getAllClients);

module.exports = router;
