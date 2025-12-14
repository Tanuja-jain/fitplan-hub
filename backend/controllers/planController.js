const FitnessPlan = require("../models/FitnessPlan");

/**
 * CREATE FITNESS PLAN (Trainer only)
 */
exports.createPlan = async (req, res) => {
  try {
    const { title, description, price, duration } = req.body;

    const plan = await FitnessPlan.create({
      title,
      description,
      price,
      duration,
      trainer: req.user.id
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Failed to create plan" });
  }
};

/**
 * GET ALL PLANS CREATED BY LOGGED-IN TRAINER
 */
exports.getMyPlans = async (req, res) => {
  try {
    const plans = await FitnessPlan.find({ trainer: req.user.id });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

/**
 * UPDATE FITNESS PLAN (Trainer owns it)
 */
exports.updatePlan = async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (plan.trainer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(plan, req.body);
    await plan.save();

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: "Failed to update plan" });
  }
};

/**
 * DELETE FITNESS PLAN (Trainer owns it)
 */
exports.deletePlan = async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (plan.trainer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await plan.deleteOne();
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete plan" });
  }
};
