import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [showForm, setShowForm] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		startDate: "",
		endDate: "",
	});

	// =========================
	// Fetch Projects
	// =========================
	const fetchProjects = async () => {
		try {
			setLoading(true);
			setError("");

			const response = await API.get("/projects");

			if (response.data.success) {
				setProjects(response.data.projects);
			}
		} catch (error) {
			console.error("Get Projects Error:", error);

			setError(
				error.response?.data?.message ||
				"Failed to load projects"
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	// =========================
	// Form Change
	// =========================
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// =========================
	// Create Project
	// =========================
	const handleCreateProject = async (e) => {
		e.preventDefault();

		try {
			setError("");

			const response = await API.post(
				"/projects",
				formData
			);

			if (response.data.success) {
				alert("Project created successfully");

				setFormData({
					name: "",
					description: "",
					startDate: "",
					endDate: "",
				});

				setShowForm(false);

				fetchProjects();
			}
		} catch (error) {
			console.error("Create Project Error:", error);

			setError(
				error.response?.data?.message ||
				"Failed to create project"
			);
		}
	};

	// =========================
	// Logout
	// =========================
	const handleLogout = async () => {
		await logout();
	};

	return (
		<div>

			{/* ================= HEADER ================= */}

			<header>
				<h1>Trello Lite</h1>

				<div>
					<span>
						{user?.name} ({user?.role})
					</span>

					<button onClick={handleLogout}>
						Logout
					</button>
				</div>
			</header>


			{/* ================= MAIN ================= */}

			<main>

				<div>
					<h2>My Projects</h2>

					{/* Create button */}

					{(user?.role === "admin" ||
						user?.role === "manager") && (
							<button
								onClick={() => setShowForm(!showForm)}
							>
								{showForm
									? "Cancel"
									: "+ Create Project"}
							</button>
						)}
				</div>


				{/* ================= ERROR ================= */}

				{error && (
					<p>
						{error}
					</p>
				)}


				{/* ================= CREATE FORM ================= */}

				{showForm && (
					<form onSubmit={handleCreateProject}>

						<div>
							<label>
								Project Name
							</label>

							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="Enter project name"
								required
							/>
						</div>


						<div>
							<label>
								Description
							</label>

							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Enter project description"
							/>
						</div>


						<div>
							<label>
								Start Date
							</label>

							<input
								type="date"
								name="startDate"
								value={formData.startDate}
								onChange={handleChange}
							/>
						</div>


						<div>
							<label>
								End Date
							</label>

							<input
								type="date"
								name="endDate"
								value={formData.endDate}
								onChange={handleChange}
							/>
						</div>


						<button type="submit">
							Create Project
						</button>

					</form>
				)}


				{/* ================= PROJECT LIST ================= */}

				{loading && (
					<p>Loading projects...</p>
				)}


				{!loading &&
					!error &&
					projects.length === 0 && (
						<p>
							No projects found.
						</p>
					)}


				{!loading &&
					!error &&
					projects.length > 0 && (

						<div>

							{projects.map((project) => (

								<div
									key={project._id}
									onClick={() =>
										navigate(`/projects/${project._id}`)
									}
									style={{ cursor: "pointer" }}
								>

									<h3>
										{project.name}
									</h3>

									<p>
										{project.description ||
											"No description"}
									</p>

									<p>
										Created by:{" "}
										{project.createdBy?.name}
									</p>

									<p>
										Members:{" "}
										{project.members?.length || 0}
									</p>

								</div>

							))}

						</div>
					)}

			</main>

		</div>
	);
};

export default Dashboard;