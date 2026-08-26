const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const corsOptions = {
	origin: process.env.FRONTEND_URL,
	methods: ["GET", "POST", "DELETE", "PUT"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

// All routers
const authRouter = require("./routes/auth");
const taskRoute = require("./routes/task");

// Connect to Database
main()
	.then(() => console.log("Database Connection established"))
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect(process.env.MONGODB_URI);
}

// Root route
app.get("/", (req, res) => {
	res.json({
		message: "Welcome to Task_Management!",
		frontend_url: process.env.FRONTEND_URL,
	});
});

// All routes
app.use("/", authRouter);
app.use("/tasks", taskRoute);

// Invalid routes
app.all("*", (req, res) => {
	res.status(404).json({ message: "404 - Resource not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
	const status = err.status || 500;
	const errorMessage = err.message || "Internal Server Error";
	res.status(status).json({ message: errorMessage });
});

// Start the server
const server = app.listen(PORT, async () => {
	console.log(`Server listening on ${PORT}`);
});
