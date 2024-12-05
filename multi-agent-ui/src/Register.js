/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");
	const [age, setAge] = useState("");
	const [role, setRole] = useState("user");
	const [errorMessage, setErrorMessage] = useState("");
	const [isAdmin, setIsAdmin] = useState(false); // New state to check if the user is admin
	const navigate = useNavigate();

	useEffect(() => {
		// Check if a user is logged in and if they have an admin role
		const token = localStorage.getItem("jwt_token");
		console.log("Retrieved Token:", token);
		if (token) {
			try {
				const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token to check role (assuming JWT structure)
				console.log("Decoded token:", decodedToken);
				if (decodedToken.role === "admin") {
					setIsAdmin(true); // Set isAdmin to true if the user is an admin
				}
			} catch (error) {
				console.error("Invalid token:", error);
			}
		}
	}, []);

	const handleRegister = async (e) => {
		e.preventDefault();

		// Check if passwords match
		if (password !== confirmPassword) {
			setErrorMessage("Passwords do not match!");
			return;
		}

		try {
			const response = await fetch(`http://localhost:8000/register?is_admin=${isAdmin}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					email,
					password,
					age,
					role,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				console.log("Registration successful", data);
				navigate("/login");
			} else {
				const errorData = await response.json();
				if (response.status === 403) {
					setErrorMessage("You need admin privileges to create an admin.");
				} else {
					setErrorMessage(errorData.message || "Registration failed. Please try again.");
				}
			}
		} catch (error) {
			setErrorMessage("An error occurred while registering. Please try again.");
		}
	};

	return (
		<div className="container">
			<h2>Register</h2>
			{errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
			<form onSubmit={handleRegister}>
				<div className="mb-3">
					<label htmlFor="name" className="form-label">
						Full Name
					</label>
					<input type="text" className="form-control form-control-sm" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
				</div>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						Email address
					</label>
					<input type="email" className="form-control form-control-sm" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				<div className="mb-3">
					<label htmlFor="password" className="form-label">
						Password
					</label>
					<input type="password" className="form-control form-control-sm" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				</div>
				<div className="mb-3">
					<label htmlFor="confirmPassword" className="form-label">
						Confirm Password
					</label>
					<input type="password" className="form-control form-control-sm" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
				</div>
				<div className="mb-3">
					<label htmlFor="age" className="form-label">
						Age
					</label>
					<input type="number" className="form-control form-control-sm" id="age" value={age} onChange={(e) => setAge(e.target.value)} required min="1" />
				</div>
				<div className="mb-3">
					<label htmlFor="role" className="form-label">
						Role
					</label>
					<select className="form-control form-control-sm" id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
						<option value="user">User</option>
						{isAdmin && <option value="admin">Admin</option>}
					</select>
				</div>
				<button type="submit" className="btn btn-primary btn-sm">
					Register
				</button>
			</form>
			<p className="mt-3">
				Already have an account? <a href="/login">Login here</a>
			</p>
		</div>
	);
};

export default Register;
