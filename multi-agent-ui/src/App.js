/** @format */

import React, { useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
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
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute
import { AuthProvider, useAuth } from "./AuthContext"; // Import useAuth here

// Configure NProgress
NProgress.configure({
	showSpinner: true,
	speed: 500,
	easing: "ease-in-out",
});

const App = () => {
	return (
		<AuthProvider>
			<SubmitProvider>
				<PopupProvider>
					<Router>
						<div className="App" style={{ fontFamily: "'Poppins', sans-serif" }}>
							{/* Pass authentication state and logout handler to Navigation */}
							<AuthContent />
						</div>
					</Router>
				</PopupProvider>
			</SubmitProvider>
		</AuthProvider>
	);
};

const AuthContent = () => {
	const { isAuthenticated, login, logout } = useAuth(); // Now it's within AuthProvider

	// Check login status when the app is first loaded
	useEffect(() => {
		const token = localStorage.getItem("jwt_token");
		if (token) {
			login(); // Update authentication state using AuthContext
		}
	}, [login]);

	return (
		<div>
			<Navigation isLoggedIn={isAuthenticated} handleLogout={logout} />

			{/* Page Routes */}
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/about" element={<AboutPage />} />

				{/* Protected Routes */}
				<Route
					path="/dateplan"
					element={
						<ProtectedRoute>
							<DatePlanForm />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/result"
					element={
						<ProtectedRoute>
							<DatePlanResult />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/userschedules"
					element={
						<ProtectedRoute>
							<UserSchedules />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/datamanagement"
					element={
						<ProtectedRoute>
							<DataManagement />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/convertemb"
					element={
						<ProtectedRoute>
							<IngestEmbeddingsForm />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/github-issues"
					element={
						<ProtectedRoute>
							<GitHubIssuesPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</div>
	);
};

export default App;
