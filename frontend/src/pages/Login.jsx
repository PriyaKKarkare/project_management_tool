import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Login = () => {
	const navigate = useNavigate();
	const { getCurrentUser } = useAuth();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setError("");
		setLoading(true);

		try {
			const response = await API.post("/auth/login", formData);

			console.log("Login Response:", response.data);
			console.log("Current User:", response.data);

			if (response.data.success) {
				await getCurrentUser();
				navigate("/dashboard");
			}
		} catch (error) {
			console.error("Login Error:", error);

			setError(
				error.response?.data?.message ||
				"Login failed. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1>Login</h1>

				<p>Login to your Trello Lite account</p>

				{error && (
					<div className="error-message">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Email</label>

						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Enter your email"
							required
						/>
					</div>

					<div className="form-group">
						<label>Password</label>

						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Enter your password"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;