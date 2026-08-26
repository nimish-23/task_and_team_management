const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		priority: {
			type: String,
			enum: ['Low', 'Medium', 'High'],
			required: true,
		},
		status: {
			type: String,
			enum: ['Pending', 'In Progress', 'Completed'],
			default: 'Pending',
		},
		dueDate: {
			type: Date,
			required: true,
		},
		assignedUser: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
		createdBy: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		}
	},
	{
		timestamps: true,
	}
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
