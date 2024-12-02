/** @format */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true); // Add isLoading state
	const navigate = useNavigate(); // To navigate after logout

	// Check login status when the component mounts and also if localStorage changes
	useEffect(() => {
		const token = localStorage.getItem("jwt_token");
		if (token) {
			setIsLoggedIn(true); // User is logged in
		}
		setIsLoading(false); // Set loading to false after checking

		// Listen for changes in localStorage (e.g., after login/logout)
		const handleStorageChange = () => {
			const token = localStorage.getItem("jwt_token");
			setIsLoggedIn(!!token); // Update login status based on token existence
		};

		window.addEventListener("storage", handleStorageChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange); // Clean up event listener
		};
	}, []);

	// Show loading spinner or message while the login status is being determined
	if (isLoading) {
		return <div>Loading...</div>; // Optionally render a loading indicator
	}

	// Handle Logout
	const handleLogout = () => {
		localStorage.removeItem("jwt_token"); // Remove the token on logout
		setIsLoggedIn(false); // Update the UI to reflect logout
		navigate("/login"); // Redirect to login page after logout
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">
					Home
				</Link>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav">
						{isLoggedIn ? (
							<>
								<li className="nav-item">
									<Link className="nav-link" to="/dateplan">
										Date Planner
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/result">
										Date Plan Result
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/convertemb">
										Data Management
									</Link>
								</li>
								<li className="nav-item">
									<button className="nav-link btn btn-link" onClick={handleLogout}>
										Logout
									</button>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/register">
										Register
									</Link>
								</li>
							</>
						) : (
							<>
								<li className="nav-item">
									<Link className="nav-link" to="/login">
										Login
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navigation;
