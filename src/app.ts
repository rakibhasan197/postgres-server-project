import express from "express";
import cors from "cors";
import apiRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { prisma } from "./lib/prisma";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Postgres Server Project API!",
    status: "OK",
    timestamp: new Date(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Next.js practice-simple-crud-client compatibility endpoints
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    const mapped = users.map(u => ({ ...u, _id: u.id }));
    res.status(200).json(mapped);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.params.id, isDeleted: false },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.status(200).json({ ...user, _id: user.id });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.params.id, isDeleted: false },
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    await prisma.user.update({
      where: { id: req.params.id },
      data: { isDeleted: true },
    });
    res.status(200).json({ deletedCount: 1 });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use("/api/v1", apiRouter);

app.use(errorHandler);

export default app;
