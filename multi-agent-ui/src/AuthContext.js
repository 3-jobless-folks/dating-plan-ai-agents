/** @format */

import React, { createContext, useState, useEffect } from "react";

// Create Context for Auth
const AuthContext = createContext();

// Custom Hook to use AuthContext
export const useAuth = () => {
	return React.useContext(AuthContext);
};

// AuthProvider to manage authentication state and provide it to the app
export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// On component mount, check if the JWT token exists in localStorage
	useEffect(() => {
		const token = localStorage.getItem("jwt_token");
		if (token) {
			setIsAuthenticated(true); // Set the authentication state to true if token is found
		}
	}, []);

	// Login function to set authentication state to true
	const login = () => {
		setIsAuthenticated(true);
	};

	// Logout function to set authentication state to false and remove the token from localStorage
	const logout = () => {
		setIsAuthenticated(false);
		localStorage.removeItem("jwt_token"); // Optionally, clear the token on logout
	};

	return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};
