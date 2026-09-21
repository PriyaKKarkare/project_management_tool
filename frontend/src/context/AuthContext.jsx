import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();

	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Check logged-in user
	const getCurrentUser = async () => {
		try {
			const response = await API.get("/auth/me");

			if (response.data.success) {
				setUser(response.data.user);
			}
		} catch (error) {
			console.log("User not logged in");
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getCurrentUser();
	}, []);

	// Logout
	const logout = async () => {
		try {
			await API.post("/auth/logout");
			setUser(null);
			navigate("/login");
		} catch (error) {
			console.error("Logout Error:", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				loading,
				logout,
				getCurrentUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};