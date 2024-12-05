/** @format */

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated } = useAuth();
	const [loading, setLoading] = useState(true);
	console.log("Checking authentication: ", isAuthenticated);
	useEffect(() => {
		// Simulate a delay to check authentication status
		const timer = setTimeout(() => {
			setLoading(false); // Authentication check complete
		}, 500); // You can adjust the delay here if needed

		return () => clearTimeout(timer); // Cleanup the timeout on unmount
	}, []);
	if (loading) {
		// You can render a loading spinner or a placeholder while checking
		return <div>Loading...</div>;
	}
	if (!isAuthenticated) {
		// Redirect to login page if not authenticated
		return <Navigate to="/login" />;
	}

	return children; // Render protected content if authenticated
};

export default ProtectedRoute;
