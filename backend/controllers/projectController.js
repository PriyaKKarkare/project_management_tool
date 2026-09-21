const Project = require("../models/Project");

// ==========================================
// Create Project
// ==========================================

const createProject = async (req, res) => {
	try {
		const {
			name,
			description,
			startDate,
			endDate,
			members,
		} = req.body;

		// 1. Check project name
		if (!name) {
			return res.status(400).json({
				success: false,
				message: "Project name is required",
			});
		}

		// 2. Create project
		const project = await Project.create({
			name: name.trim(),
			description,
			startDate,
			endDate,
			members,
			createdBy: req.user._id,
		});

		// 3. Response
		return res.status(201).json({
			success: true,
			message: "Project created successfully",
			project,
		});
	} catch (error) {
		console.error("Create Project Error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

// ==========================================
// Get All Projects
// ==========================================

const getProjects = async (req, res) => {
	try {
		const projects = await Project.find()
			.populate("createdBy", "name email")
			.populate("members", "name email")
			.sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			count: projects.length,
			projects,
		});
	} catch (error) {
		console.error("Get Projects Error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

// ==========================================
// Get Single Project
// ==========================================

const getProject = async (req, res) => {
	try {
		const { id } = req.params;

		const project = await Project.findById(id)
			.populate("createdBy", "name email")
			.populate("members", "name email");

		// Project सापडला नाही
		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		return res.status(200).json({
			success: true,
			project,
		});
	} catch (error) {
		console.error("Get Project Error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

// ==========================================
// Update Project
// Admin + Manager
// ==========================================

const updateProject = async (req, res) => {
	try {
		const { id } = req.params;

		const {
			name,
			description,
			startDate,
			endDate,
			members,
		} = req.body;

		// 1. Find project
		const project = await Project.findById(id);

		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		// 2. Update only provided fields

		if (name !== undefined) {
			project.name = name.trim();
		}

		if (description !== undefined) {
			project.description = description;
		}

		if (startDate !== undefined) {
			project.startDate = startDate;
		}

		if (endDate !== undefined) {
			project.endDate = endDate;
		}

		if (members !== undefined) {
			project.members = members;
		}

		// 3. Save updated project
		await project.save();

		// 4. Response
		return res.status(200).json({
			success: true,
			message: "Project updated successfully",
			project,
		});
	} catch (error) {
		console.error("Update Project Error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

// ==========================================
// Delete Project
// Admin only
// ==========================================

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find project
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 2. Delete project
    await Project.findByIdAndDelete(id);

    // 3. Response
    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
	createProject,
	getProjects,
	getProject,
	updateProject,
	deleteProject,
};