import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const items = await Contact.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post("/", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message || "Unable to save contact" });
  }
});

export default router;

