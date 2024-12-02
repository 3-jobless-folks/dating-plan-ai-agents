/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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
				localStorage.setItem("jwt_token", data.token); // Store the JWT token
				navigate("/"); // Redirect to home after login
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
					<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control" />
				</div>
				<div className="mb-3">
					<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control" />
				</div>
				<button type="submit" className="btn btn-primary">
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
