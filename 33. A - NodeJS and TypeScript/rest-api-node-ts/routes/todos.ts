import { Router } from "express";

// For this dummy REST API we store the TTodos here. Only in memory
const todos = [];

const router = Router();

// Registering the routes wee need:
// Fettching all todos:
router.get("/", (req, res, next) => {
	res.status(200).json({ todos: todos });
});

export default router;
