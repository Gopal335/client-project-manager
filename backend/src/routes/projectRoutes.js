import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const items = await Project.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post("/", async (req, res) => {
  try {
    console.log("Received project data:", req.body);
    const project = await Project.create(req.body);
    console.log("Project created successfully:", project._id);
    res.status(201).json(project);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(400).json({ message: err.message || "Unable to create project" });
  }
});

export default router;

