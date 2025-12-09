import express from "express";
import Client from "../models/Client.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const items = await Client.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post("/", async (req, res) => {
  try {
    console.log("Received client data:", req.body);
    const client = await Client.create(req.body);
    console.log("Client created successfully:", client._id);
    res.status(201).json(client);
  } catch (err) {
    console.error("Error creating client:", err);
    res.status(400).json({ message: err.message || "Unable to create client" });
  }
});

export default router;

