/** @format */

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./Navigation"; // Import Navigation
import DatePlanForm from "./DatePlanForm";
import DatePlanResult from "./DatePlanResult";
import IngestEmbeddingsForm from "./ConvertEmbeddings";
import UserSchedules from "./UserSchedules";
import Home from "./Home";
import Login from "./Login"; // Login component
import Register from "./Register"; // Register component

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
		setIsLoggedIn(false); // Update login state
	};

	return (
		<Router>
			<div className="App">
				{/* Pass login state and logout handler to Navigation */}
				<Navigation isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

				{/* Page Routes */}
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/dateplan" element={<DatePlanForm />} />
					<Route path="/result" element={<DatePlanResult />} />
					<Route path="/userschedules" element={<UserSchedules />} />
					<Route path="/convertemb" element={<IngestEmbeddingsForm />} />
					<Route path="/login" element={<Login onLogin={handleLogin} />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
