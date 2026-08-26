const express = require("express");
const router = express.Router();
const {
	getTask,
	getAllTask,
	addTask,
	updateTask,
	deleteTask
} = require("../controllers/task");
const wrapAsync = require("../middleware/wrapAsync");
const { authorization } = require("../middleware/authorization");

router.get("/", authorization, wrapAsync(getAllTask));
router.get("/:id", authorization, wrapAsync(getTask));
router.post("/", authorization, wrapAsync(addTask));
router.put("/:id", authorization, wrapAsync(updateTask));
router.delete("/:id", authorization, wrapAsync(deleteTask));

module.exports = router;
