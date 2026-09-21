const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

// ==========================================
// Create Task
// ==========================================

const createTask = async (req, res) => {
	try {
		const {
			title,
			description,
			priority,
			projectId,
			assignedTo,
			dueDate,
		} = req.body;

		// 1. Required fields
		if (!title || !projectId) {
			return res.status(400).json({
				success: false,
				message: "Title and projectId are required",
			});
		}

		// 2. Check project exists
		const project = await Project.findById(projectId);

		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		// 3. Check assigned user exists
		if (assignedTo) {
			const user = await User.findById(assignedTo);

			if (!user) {
				return res.status(404).json({
					success: false,
					message: "Assigned user not found",
				});
			}
		}

		// 4. Create task
		const task = await Task.create({
			title: title.trim(),
			description,
			priority,
			projectId,
			assignedTo,
			dueDate,
			createdBy: req.user._id,
		});

		return res.status(201).json({
			success: true,
			message: "Task created successfully",
			task,
		});
	} catch (error) {
		console.error("Create Task Error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

// ==========================================
// Get All Tasks by Project
// ==========================================

const getTasksByProject = async (req, res) => {
	try {
		const { projectId } = req.params;

		// Check project exists
		const project = await Project.findById(projectId);

		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		// Get tasks
		const tasks = await Task.find({ projectId })
			.populate("assignedTo", "name email role")
			.populate("createdBy", "name email")
			.sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			count: tasks.length,
			tasks,
		});
	} catch (error) {
		console.error("Get Tasks Error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

// ==========================================
// Get Single Task
// ==========================================

const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate("projectId", "name description")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// Update Task
// ==========================================

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
    } = req.body;

    // 1. Find task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 2. Update fields only if provided

    if (title !== undefined) {
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (assignedTo !== undefined) {
      if (assignedTo) {
        const user = await User.findById(assignedTo);

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "Assigned user not found",
          });
        }
      }

      task.assignedTo = assignedTo;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate;
    }

    // 3. Save changes
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// Delete Task
// ==========================================

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await Task.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
	createTask,
	getTasksByProject,
	  getTask,
	updateTask,
	deleteTask,
};