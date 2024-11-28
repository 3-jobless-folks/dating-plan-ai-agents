/** @format */

// src/DatePlanForm.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DatePlanForm = () => {
	const [formData, setFormData] = useState({
		start_time: "",
		end_time: "",
		indoor_outdoor: "",
		country: "",
		budget: "",
		food_preference: "",
		activity_preference: "",
	});

	const [result, setResult] = useState(""); // Initialize result state
	const [errors, setErrors] = useState({}); // For storing validation errors
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// Simple validation function
	const validateForm = () => {
		const newErrors = {};
		for (const key in formData) {
			if (formData[key] === "") {
				newErrors[key] = `${key.replace(/_/g, " ")} is required`;
			}
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0; // If no errors, return true
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate the form before sending
		if (!validateForm()) {
			return; // Don't submit if validation fails
		}

		// Send request to FastAPI
		try {
			const response = await axios.post("http://localhost:8000/plan", formData);
			console.log("Backend response:", response.data);

			// Navigate to the result page and pass the response data

			navigate("/result", { state: { result: response.data.result } });
		} catch (error) {
			console.error("Error sending data to backend", error);
			setResult("An error occurred while fetching the data.");
		}
	};

	return (
		<div className="container mt-5">
			<h2>Create Your Date Plan</h2>
			<form onSubmit={handleSubmit}>
				{/* Start Time */}
				<div className="mb-3">
					<label className="form-label">Start Time</label>
					<input type="text" className={`form-control ${errors.start_time ? "is-invalid" : ""}`} name="start_time" value={formData.start_time} onChange={handleChange} />
					{errors.start_time && <div className="invalid-feedback">{errors.start_time}</div>}
				</div>

				{/* End Time */}
				<div className="mb-3">
					<label className="form-label">End Time</label>
					<input type="text" className={`form-control ${errors.end_time ? "is-invalid" : ""}`} name="end_time" value={formData.end_time} onChange={handleChange} />
					{errors.end_time && <div className="invalid-feedback">{errors.end_time}</div>}
				</div>

				{/* Indoor/Outdoor */}
				<div className="mb-3">
					<label className="form-label">Indoor/Outdoor</label>
					<input type="text" className={`form-control ${errors.indoor_outdoor ? "is-invalid" : ""}`} name="indoor_outdoor" value={formData.indoor_outdoor} onChange={handleChange} />
					{errors.indoor_outdoor && <div className="invalid-feedback">{errors.indoor_outdoor}</div>}
				</div>

				{/* Country */}
				<div className="mb-3">
					<label className="form-label">Country</label>
					<input type="text" className={`form-control ${errors.country ? "is-invalid" : ""}`} name="country" value={formData.country} onChange={handleChange} />
					{errors.country && <div className="invalid-feedback">{errors.country}</div>}
				</div>

				{/* Budget */}
				<div className="mb-3">
					<label className="form-label">Budget</label>
					<input type="text" className={`form-control ${errors.budget ? "is-invalid" : ""}`} name="budget" value={formData.budget} onChange={handleChange} />
					{errors.budget && <div className="invalid-feedback">{errors.budget}</div>}
				</div>

				{/* Food Preference */}
				<div className="mb-3">
					<label className="form-label">Food Preference</label>
					<input type="text" className={`form-control ${errors.food_preference ? "is-invalid" : ""}`} name="food_preference" value={formData.food_preference} onChange={handleChange} />
					{errors.food_preference && <div className="invalid-feedback">{errors.food_preference}</div>}
				</div>

				{/* Activity Preference */}
				<div className="mb-3">
					<label className="form-label">Activity Preference</label>
					<input
						type="text"
						className={`form-control ${errors.activity_preference ? "is-invalid" : ""}`}
						name="activity_preference"
						value={formData.activity_preference}
						onChange={handleChange}
					/>
					{errors.activity_preference && <div className="invalid-feedback">{errors.activity_preference}</div>}
				</div>

				<button type="submit" className="btn btn-primary">
					Submit
				</button>
			</form>

			{/* Display the result */}
			{result && (
				<div className="mt-4">
					<h3>Final Date Plan</h3>
					{/* Display the result as a formatted JSON object */}
					<pre>{JSON.stringify(result, null, 2)}</pre>
				</div>
			)}
		</div>
	);
};

export default DatePlanForm;