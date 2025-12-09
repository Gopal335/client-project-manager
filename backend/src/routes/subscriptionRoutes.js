import express from "express";
import Subscription from "../models/Subscription.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const items = await Subscription.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post("/", async (req, res) => {
  try {
    const subscription = await Subscription.create(req.body);
    res.status(201).json(subscription);
  } catch (err) {
    res
      .status(400)
      .json({ message: err.code === 11000 ? "Email already subscribed" : err.message });
  }
});

export default router;

