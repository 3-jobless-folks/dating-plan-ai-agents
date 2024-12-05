/** @format */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FaHome, FaCalendarAlt, FaList, FaCog, FaSignOutAlt, FaInfoCircle, FaSignInAlt, FaUserPlus, FaUsers, FaCodeBranch } from "react-icons/fa"; // Import React Icons

const Navigation = ({ isLoggedIn, handleLogout }) => {
	const [isLoading, setIsLoading] = useState(true);
	const { logout } = useAuth();

	const navigate = useNavigate();

	// Show loading spinner or message while the login status is being determined
	useEffect(() => {
		setIsLoading(false);
	}, []);

	// Handle Logout
	const handleLogoutClick = () => {
		handleLogout(); // Call logout handler passed from App.js
		logout();
		navigate("/login"); // Redirect to login page after logout
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-primary shadow-sm">
			<div className="container-fluid">
				<Link className="navbar-brand text-white" to="/">
					<strong>
						<FaHome /> Home
					</strong>{" "}
					{/* Adding icon to Home */}
				</Link>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto">
						{isLoggedIn ? (
							<>
								<li className="nav-item">
									<Link className="nav-link text-white" to="/dateplan">
										<FaCalendarAlt /> Date Planner {/* Adding icon to Date Planner */}
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link text-white" to="/result">
										<FaList /> Date Plan Result {/* Adding icon to Date Plan Result */}
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link text-white" to="/userschedules">
										<FaList /> My Schedules {/* Adding icon to My Schedules */}
									</Link>
								</li>
								{/* Data Management Dropdown */}
								<li className="nav-item dropdown">
									<a className="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										<FaCog /> Admin Console {/* Adding icon to Admin Console */}
									</a>
									<ul className="dropdown-menu" aria-labelledby="navbarDropdown">
										<li>
											<Link className="dropdown-item" to="/convertemb">
												<FaCog /> Convert Embedding {/* Adding icon to Convert Embedding */}
											</Link>
										</li>
										<li>
											<Link className="dropdown-item" to="/datamanagement">
												<FaCog /> Data Management {/* Adding icon to Data Management */}
											</Link>
										</li>
									</ul>
								</li>
								<li className="nav-item dropdown">
									<a className="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										<FaInfoCircle /> About Us {/* Adding icon to Admin Console */}
									</a>
									<ul className="dropdown-menu" aria-labelledby="navbarDropdown">
										<li>
											<Link className="dropdown-item" to="/about">
												<FaUsers /> The Team {/* Adding icon to Convert Embedding */}
											</Link>
										</li>
										<li>
											<Link className="dropdown-item" to="/github-issues">
												<FaCodeBranch /> The Issues {/* Adding icon to Data Management */}
											</Link>
										</li>
									</ul>
								</li>
								<li className="nav-item">
									<button className="nav-link text-white border-0 bg-transparent" onClick={handleLogoutClick}>
										<FaSignOutAlt /> Logout {/* Adding icon to Logout */}
									</button>
								</li>
							</>
						) : (
							<>
								<li className="nav-item dropdown">
									<a className="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										<FaInfoCircle /> About Us {/* Adding icon to Admin Console */}
									</a>
									<ul className="dropdown-menu" aria-labelledby="navbarDropdown">
										<li>
											<Link className="dropdown-item" to="/about">
												<FaUsers /> The Team {/* Adding icon to Convert Embedding */}
											</Link>
										</li>
									</ul>
								</li>
								<li className="nav-item">
									<Link className="nav-link text-white" to="/login">
										<FaSignInAlt /> Login {/* Adding icon to Login */}
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link text-white" to="/register">
										<FaUserPlus /> Register {/* Adding icon to Register */}
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
