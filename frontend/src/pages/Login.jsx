import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

	// =========================
	// Handle Input Change
	// =========================

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// =========================
	// Login
	// =========================

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			setError("");

			const response = await API.post(
				"/auth/login",
				formData
			);

			if (response.data.success) {
				await getCurrentUser();

				navigate("/dashboard");
			}
		} catch (error) {
			console.error("Login Error:", error);

			setError(
				error.response?.data?.message ||
				"Invalid email or password"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">

			<div className="container">

				<div className="row justify-content-center">

					<div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

						{/* Login Card */}

						<div className="card border-0 shadow-lg">

							<div className="card-body p-4 p-md-5">

								{/* Logo */}

								<div className="text-center mb-4">

									<div
										className="bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
										style={{
											width: "58px",
											height: "58px",
											fontSize: "25px",
											fontWeight: "700",
										}}
									>
										T
									</div>
									<h2 className="fw-bold text-dark mb-2">
										Welcome Back!
									</h2>

									<p className="text-muted mb-0">
										Sign in to continue to Trello Lite
									</p>

								</div>

								{/* Error */}

								{error && (
									<div
										className="alert alert-danger py-2"
										role="alert"
									>
										{error}
									</div>
								)}

								{/* Login Form */}

								<form onSubmit={handleSubmit}>

									{/* Email */}

									<div className="mb-3">

										<label
											htmlFor="email"
											className="form-label fw-semibold"
										>
											Email
										</label>

										<input
											id="email"
											type="email"
											name="email"
											className="form-control form-control-lg"
											placeholder="Enter your email"
											value={formData.email}
											onChange={handleChange}
											autoComplete="email"
											required
										/>

									</div>

									{/* Password */}

									<div className="mb-4">

										<label
											htmlFor="password"
											className="form-label fw-semibold"
										>
											Password
										</label>

										<input
											id="password"
											type="password"
											name="password"
											className="form-control form-control-lg"
											placeholder="Enter your password"
											value={formData.password}
											onChange={handleChange}
											autoComplete="current-password"
											required
										/>

									</div>

									{/* Login Button */}

									<button
										type="submit"
										className="btn btn-primary btn-lg w-100"
										disabled={loading}
									>
										{loading ? (
											<>
												<span
													className="spinner-border spinner-border-sm me-2"
													role="status"
												></span>

												Logging in...
											</>
										) : (
											"Login"
										)}
									</button>

								</form>

							</div>

						</div>

						{/* Bottom Text */}

						<p className="text-center text-muted mt-4 small">
							Trello Lite · Task & Project Management
						</p>

					</div>

				</div>

			</div>

		</div>
	);
};

export default Login;