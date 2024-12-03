/** @format */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = ({ isLoggedIn, handleLogout }) => {
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	// Show loading spinner or message while the login status is being determined
	useEffect(() => {
		setIsLoading(false);
	}, []);

	// Handle Logout
	const handleLogoutClick = () => {
		handleLogout(); // Call logout handler passed from App.js
		navigate("/login"); // Redirect to login page after logout
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

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
									<Link className="nav-link" to="/userschedules">
										My Schedules
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/convertemb">
										Data Management
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/about">
										About Us
									</Link>
								</li>
								<li className="nav-item">
									<button className="nav-link" onClick={handleLogoutClick}>
										Logout
									</button>
								</li>
							</>
						) : (
							<>
								<li className="nav-item">
									<Link className="nav-link" to="/login">
										Login
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/register">
										Register
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
