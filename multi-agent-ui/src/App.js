/** @format */

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Remove Switch and use Routes in v6
import Navigation from "./Navigation"; // Import Navigation
import DatePlanForm from "./DatePlanForm";
import DatePlanResult from "./DatePlanResult";
import IngestEmbeddingsForm from "./ConvertEmbeddings";
import UserSchedules from "./UserSchedules";
import Home from "./Home";
import Login from "./Login"; // Login component
import Register from "./Register"; // Register component
import AboutPage from "./AboutPage";
import NProgress from "nprogress";
import DataManagement from "./DataManagement";
import "nprogress/nprogress.css";
import { SubmitProvider } from "./SubmitContext";
import { PopupProvider } from "./PopupContext";
import GitHubIssuesPage from "./GitHubIssuesPage";

// Configure NProgress
NProgress.configure({
	showSpinner: true, // Disable spinner
	speed: 500, // Increase or decrease the speed
	easing: "ease-in-out", // Change easing effect
});

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Check login status when the app is first loaded
	useEffect(() => {
		const token = localStorage.getItem("jwt_token");
		if (token) {
			setIsLoggedIn(true); // User is logged in if a token exists
		}
	}, []);

	const handleLogin = (token) => {
		localStorage.setItem("jwt_token", token); // Save token to localStorage
		setIsLoggedIn(true); // Update login state
	};

	const handleLogout = () => {
		localStorage.removeItem("jwt_token"); // Remove token from localStorage
		localStorage.removeItem("datePlan");
		setIsLoggedIn(false); // Update login state
	};

	return (
		<SubmitProvider>
			<PopupProvider>
				<Router>
					<div className="App" style={{ fontFamily: "'Poppins', sans-serif" }}>
						{/* Pass login state and logout handler to Navigation */}
						<Navigation isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

						{/* Page Routes */}
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/dateplan" element={<DatePlanForm />} />
							<Route path="/result" element={<DatePlanResult />} />
							<Route path="/userschedules" element={<UserSchedules />} />
							<Route path="/datamanagement" element={<DataManagement />} />
							<Route path="/convertemb" element={<IngestEmbeddingsForm />} />
							<Route path="/login" element={<Login onLogin={handleLogin} />} />
							<Route path="/register" element={<Register />} />
							<Route path="/about" element={<AboutPage />} />
							<Route path="/github-issues" element={<GitHubIssuesPage />} /> {/* Corrected the route */}
						</Routes>
					</div>
				</Router>
			</PopupProvider>
		</SubmitProvider>
	);
};

export default App;

