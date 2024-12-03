/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";

const IngestEmbeddingsForm = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
	const [file, setFile] = useState(null);
	const [users, setUsers] = useState([]); // To hold user data
	const [schedules, setSchedules] = useState([]); // To hold schedule data
	const [role, setRole] = useState(null); // To hold role data

	// Fetch user role from the backend using the JWT token
	const fetchUserRole = async () => {
		const token = localStorage.getItem("jwt_token");
		console.log("Retrieved Token:", token);
		if (token) {
			try {
				// Assuming the backend has a `get_user_role` endpoint
				const response = await axios.get("http://localhost:8000/get_user_role", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setRole(response.data.role); // Assuming the response contains the role
			} catch (error) {
				console.error("Error fetching user role:", error);
				setError("Failed to fetch user role.");
			}
		}
	};

	// Fetch users from the backend
	const fetchUsers = async () => {
		try {
			const response = await axios.get("http://localhost:8000/get_users");
			setUsers(response.data);
		} catch (error) {
			console.error("Error fetching users:", error);
			setError("Failed to fetch users.");
		}
	};

	// Fetch schedules from the backend
	const fetchSchedules = async () => {
		try {
			const response = await axios.get("http://localhost:8000/get_schedules");
			setSchedules(response.data);
		} catch (error) {
			console.error("Error fetching schedules:", error);
			setError("Failed to fetch schedules.");
		}
	};

	// Use useEffect to load data when the component mounts
	useEffect(() => {
		fetchUsers();
		fetchSchedules();
		fetchUserRole(); // Get the user role when the component mounts
	}, []);

	// Check if the user is an admin before rendering the page
	if (role !== "admin") {
		return <div>You do not have permission to access this page.</div>;
	}

	// Handle button click to trigger the ingestion process for MongoDB data
	const handleIngestClick = async () => {
		setLoading(true);
		setError(null);
		setMessage(null);

		try {
			// Make a request to the FastAPI backend to ingest MongoDB data into Pinecone
			const response = await axios.post("http://localhost:8000/ingest_mongodb_embeddings");
			console.log("Backend response:", response.data);
			setMessage(response.data.result);
		} catch (error) {
			console.error("Error ingesting data:", error);
			setError("Failed to ingest data. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	// Handle file input change for CSV
	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
	};

	// Handle button click to trigger CSV file conversion
	const handleCSVConversionClick = async () => {
		if (!file) {
			setError("Please select a CSV file to upload.");
			return;
		}

		setLoading(true);
		setError(null);
		setMessage(null);

		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await axios.post("http://localhost:8000/upload-csv/", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			setMessage(response.data.message);
		} catch (error) {
			console.error("Error uploading CSV:", error);
			setError("Failed to convert CSV file. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mt-4">
			{/* Buttons for Ingesting and CSV Upload */}
			<div className="mb-4">
				<h3>Convert Embeddings</h3>
				<button onClick={handleIngestClick} className="btn btn-primary" disabled={loading}>
					{loading ? (
						<span>
							<i className="spinner-border spinner-border-sm me-2"></i>Embedding...
						</span>
					) : (
						<span>
							<i className="bi bi-database me-2"></i>Embed Data
						</span>
					)}
				</button>
			</div>

			<div className="mb-4">
				<h3>Convert CSV Data</h3>
				<input type="file" accept=".csv" onChange={handleFileChange} className="form-control" />
				<button onClick={handleCSVConversionClick} className="btn btn-secondary mt-3" disabled={loading || !file}>
					{loading ? (
						<span>
							<i className="spinner-border spinner-border-sm me-2"></i>Uploading...
						</span>
					) : (
						<span>
							<i className="bi bi-file-earmark-arrow-up me-2"></i>Store CSV Data
						</span>
					)}
				</button>
			</div>

			{/* Users Table */}
			<h3 className="mt-4">Users</h3>
			<div className="table-responsive">
				<table className="table table-striped table-bordered">
					<thead className="table-dark">
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Age</th>
						</tr>
					</thead>
					<tbody>
						{users.length === 0 ? (
							<tr>
								<td colSpan="4" className="text-center">
									No users available.
								</td>
							</tr>
						) : (
							users.map((user) => (
								<tr key={user.index_id}>
									<td>{user.index_id}</td>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>{user.age}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Schedules Table */}
			<h3 className="mt-4">Schedules</h3>
			<div className="table-responsive">
				<table className="table table-striped table-bordered">
					<thead className="table-dark">
						<tr>
							<th>ID</th>
							<th>User ID</th>
							<th>Date</th>
							<th>Activity</th>
						</tr>
					</thead>
					<tbody>
						{schedules.length === 0 ? (
							<tr>
								<td colSpan="4" className="text-center">
									No schedules available.
								</td>
							</tr>
						) : (
							schedules.map((schedule) => (
								<tr key={schedule.user_id}>
									<td>{schedule._id}</td>
									<td>{schedule.user_id}</td>
									<td>{schedule.created_at}</td>
									<td>
										{schedule.activities.map((activity, index) => (
											<div key={index}>
												<p>
													<strong>Activities:</strong> {activity.activity}
												</p>
												<p>
													<strong>Location:</strong> {activity.location}
												</p>
												<p>
													<strong>Time:</strong> {activity.time}
												</p>
												<p>
													<strong>Description:</strong> {activity.description}
												</p>
												<p>
													<strong>Cost:</strong> {activity.cost}
												</p>
											</div>
										))}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Show success or error message */}
			{message && <div className="alert alert-success mt-3">{message}</div>}
			{error && <div className="alert alert-danger mt-3">{error}</div>}
		</div>
	);
};

export default IngestEmbeddingsForm;
