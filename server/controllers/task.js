const Task = require("../models/task");

const getTask = async (req, res) => {
	try {
		const { id } = req.params;
		let task = await Task.findById(id).populate('assignedUser', 'name email').populate('createdBy', 'name email');
		if (!task) return res.status(404).json({ message: "Task not found" });
		
		const currentUserId = req.user._id.toString();
		const isCreator = task.createdBy && task.createdBy._id.toString() === currentUserId;
		const isAssignee = task.assignedUser && task.assignedUser._id.toString() === currentUserId;
		const isOldTask = !task.createdBy;

		if (!isCreator && !isAssignee && !isOldTask) {
			return res.status(403).json({ message: "Forbidden: You do not have access to this task" });
		}
		
		res.status(200).json({ message: "success", data: task });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAllTask = async (req, res) => {
	try {
		let tasks = await Task.find({
			$or: [
				{ createdBy: req.user._id },
				{ assignedUser: req.user._id },
				{ createdBy: { $exists: false } } // Allow viewing old tasks
			]
		}).populate('assignedUser', 'name email').populate('createdBy', 'name email');
		
		res.status(200).json({
			message: "success",
			data: tasks,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const addTask = async (req, res) => {
	try {
		let { title, description, priority, dueDate, status, assignedUser } = req.body;
		if (!assignedUser) assignedUser = req.user._id;

		let newTask = new Task({
			title,
			description,
			priority,
			status: status || 'Pending',
			dueDate,
			assignedUser,
			createdBy: req.user._id 
		});
		let savedTask = await newTask.save();
		let populatedTask = await Task.findById(savedTask._id).populate('assignedUser', 'name email').populate('createdBy', 'name email');
		res.status(201).json({ message: "success", data: populatedTask });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTask = async (req, res) => {
	try {
		const { id } = req.params;
		let task = await Task.findById(id);
		if (!task) return res.status(404).json({ message: "Task not found" });

		const currentUserId = req.user._id.toString();
		const isCreator = task.createdBy && task.createdBy.toString() === currentUserId;
		const isAssignee = task.assignedUser && task.assignedUser.toString() === currentUserId;
		const isOldTask = !task.createdBy;

		if (!isCreator && !isAssignee && !isOldTask) {
			return res.status(403).json({ message: "Forbidden: You are not authorized to edit this task" });
		}

		let { title, description, priority, dueDate, status, assignedUser } = req.body;
		if (!assignedUser) assignedUser = task.assignedUser;
		
		let updatedTask = await Task.findByIdAndUpdate(
			id,
			{ title, description, priority, dueDate, status, assignedUser },
			{ new: true, runValidators: true }
		).populate('assignedUser', 'name email').populate('createdBy', 'name email');
		
		res.status(200).json({ message: "success", data: updatedTask });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteTask = async (req, res) => {
	try {
		const { id } = req.params;
		let task = await Task.findById(id);
		if (!task) return res.status(404).json({ message: "Task not found" });

		const currentUserId = req.user._id.toString();
		const isCreator = task.createdBy && task.createdBy.toString() === currentUserId;
		const isOldTask = !task.createdBy;

		if (!isCreator && !isOldTask) {
			return res.status(403).json({ message: "Forbidden: Only the task creator can delete it" });
		}

		await Task.findByIdAndDelete(id);
		res.status(200).json({ message: "success", data: task });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getTask,
	getAllTask,
	addTask,
	updateTask,
	deleteTask
};
