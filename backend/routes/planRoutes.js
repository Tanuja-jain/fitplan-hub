const express = require("express");
const router = express.Router();

const {
  createPlan,
  getMyPlans,
  updatePlan,
  deletePlan
} = require("../controllers/planController");

const {
  authMiddleware,
  isTrainer
} = require("../middleware/authMiddleware");

// Trainer-only routes
router.post("/", authMiddleware, isTrainer, createPlan);
router.get("/my-plans", authMiddleware, isTrainer, getMyPlans);
router.put("/:id", authMiddleware, isTrainer, updatePlan);
router.delete("/:id", authMiddleware, isTrainer, deletePlan);

module.exports = router;
