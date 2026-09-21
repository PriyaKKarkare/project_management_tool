const express = require("express");


const {
	createTask, getTasksByProject, getTask, updateTask, deleteTask
} = require("../controllers/taskController");

const {
	protect,
	authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
	"/",
	protect,
	authorize("admin", "manager"),
	createTask
);
router.get(
	"/project/:projectId",
	protect,
	authorize("admin", "manager", "member"),
	getTasksByProject
);

// Get Single Task
router.get(
	"/:id",
	protect,
	authorize("admin", "manager", "member"),
	getTask
);

// Delete Task
router.delete(
	"/:id",
	protect,
	authorize("admin", "manager"),
	deleteTask
);

// Update Task
router.put(
	"/:id",
	protect,
	authorize("admin", "manager"),
	updateTask
);

module.exports = router;