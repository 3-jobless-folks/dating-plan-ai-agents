/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import config from "./config";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		const configData = await config();
		const API_BASE_URL = configData?.API_BASE_URL || "https://datemee.click";
		const formData = new URLSearchParams();
		formData.append("username", email);
		formData.append("password", password);

		try {
			const response = await fetch(`${API_BASE_URL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: formData,
			});
			console.log("API base url: ", API_BASE_URL);
			console.log("What is in Config? ", configData);
			if (response.ok) {
				const data = await response.json();
				// Store token in localStorage
				localStorage.setItem("jwt_token", data.token);
				login(); // Update authentication state using AuthContext
				navigate("/dateplan"); // Redirect to the date plan page
			} else {
				const errorData = await response.json();
				alert(errorData.detail || "Login failed");
			}
		} catch (error) {
			console.error("Error logging in:", error);
			console.log("What is in Config? ", configData);
			console.log("API base url: ", API_BASE_URL);
			alert("An error occurred. Please try again.");
		}
	};

	return (
		<div className="container">
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div className="mb-3">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="form-control mx-auto"
						style={{ maxWidth: "400px" }} // Makes input narrower
					/>
				</div>
				<div className="mb-3">
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="form-control mx-auto"
						style={{ maxWidth: "400px" }} // Makes input narrower
					/>
				</div>
				<button type="submit" className="btn btn-primary mx-auto d-block" style={{ maxWidth: "400px" }}>
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
