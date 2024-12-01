/** @format */

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// src/ConvertEmbeddings.js
const IngestEmbeddingsForm = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
	const [file, setFile] = useState(null);

	// Handle button click to trigger the ingestion process for MongoDB data
	const handleIngestClick = async () => {
		setLoading(true);
		setError(null);
		setMessage(null);

		try {
			// Make a request to the FastAPI backend to ingest MongoDB data into Pinecone
			const response = await axios.post("http://localhost:8000/ingest_mongodb_embeddings");

			// Assuming the backend sends a success message
			setMessage(response.data.result);
		} catch (error) {
			// Handle error during the API request
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
			// Create a form data object to send the CSV file
			const formData = new FormData();
			formData.append("file", file);

			// Make a request to the FastAPI backend to convert the CSV data
			const response = await axios.post("http://localhost:8000/upload-csv/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			// Assuming the backend sends a success message
			setMessage(response.data.message);
		} catch (error) {
			// Handle error during the API request
			console.error("Error uploading CSV:", error);
			setError("Failed to convert CSV file. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mt-4">
			<div className="container mt-4">
				<h3>Convert Embeddings</h3>
				{/* Button to trigger ingestion */}
				<button onClick={handleIngestClick} className="btn btn-primary" disabled={loading}>
					{loading ? (
						<span>
							<i className="spinner-border spinner-border-sm me-2"></i>Ingesting...
						</span>
					) : (
						<span>
							<i className="bi bi-database me-2"></i>Embed Data
						</span>
					)}
				</button>
			</div>

			{/* CSV File Upload */}
			<div className="container mt-4">
				<h3>Convert CSV Data</h3>
				<input type="file" accept=".csv" onChange={handleFileChange} className="form-control" />
				<button
					onClick={handleCSVConversionClick}
					className="btn btn-secondary mt-3"
					disabled={loading || !file} // Disable button if no file is selected or while loading
				>
					{loading ? (
						<span>
							<i className="spinner-border spinner-border-sm me-2"></i>Converting...
						</span>
					) : (
						<span>
							<i className="bi bi-file-earmark-arrow-up me-2"></i>Store CSV Data
						</span>
					)}
				</button>
			</div>

			{/* Show success or error message */}
			{message && <div className="alert alert-success mt-3">{message}</div>}
			{error && <div className="alert alert-danger mt-3">{error}</div>}
		</div>
	);
};

export default IngestEmbeddingsForm;
