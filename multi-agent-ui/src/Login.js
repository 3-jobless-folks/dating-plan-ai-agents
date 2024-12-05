/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		const formData = new URLSearchParams();
		formData.append("username", email);
		formData.append("password", password);

		try {
			const response = await fetch("http://localhost:8000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: formData,
			});

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
