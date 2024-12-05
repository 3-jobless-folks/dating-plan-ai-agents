/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";

const IngestEmbeddingsForm = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
	const [file, setFile] = useState(null);
	const [role, setRole] = useState(null);

	// Handle button click to trigger the ingestion process for MongoDB data
	const handleIngestClick = async () => {
		setLoading(true);
		setError(null);
		setMessage(null);

		try {
			// Make a request to the FastAPI backend to ingest MongoDB data into Pinecone
			const response = await axios.post(`${API_BASE_URL}/ingest_mongodb_embeddings`);
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

	// Fetch data and roles
	const fetchUserRole = async () => {
		const token = localStorage.getItem("jwt_token");
		if (token) {
			try {
				const response = await axios.get("http://localhost:8000/get_user_role", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setRole(response.data.role);
			} catch (error) {
				console.error("Error fetching user role:", error);
				setError("Failed to fetch user role.");
			}
		}
	};

	useEffect(() => {
		fetchUserRole();
	}, []);

	if (role !== "admin") {
		return <div>You do not have permission to access this page.</div>;
	}

	return (
		<div className="container mt-4">
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
		</div>
	);
};

export default IngestEmbeddingsForm;
