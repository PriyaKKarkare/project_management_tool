const express = require("express");

const {
	createProject, getProjects, getProject, updateProject, deleteProject
} = require("../controllers/projectController");

const {
	protect,
	authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// Create Project
// Admin + Manager only
// ==========================================

router.post(
	"/",
	protect,
	authorize("admin", "manager"),
	createProject
);


router.get(
	"/",
	protect,
	authorize("admin", "manager", "member"),
	getProjects
);

router.get(
	"/:id",
	protect,
	authorize("admin", "manager", "member"),
	getProject
);

router.put(
  "/:id",
  protect,
  authorize("admin", "manager"),
  updateProject
);

// ==========================================
// Delete Project
// Admin only
// ==========================================

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProject
);
module.exports = router;