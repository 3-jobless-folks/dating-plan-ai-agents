/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useNavigate } from "react-router-dom";
import { useSubmit } from "./SubmitContext";
import { usePopup } from "./PopupContext";
import config from "./config";

const DatePlanForm = () => {
	const [formData, setFormData] = useState({
		start_time: "",
		end_time: "",
		indoor_outdoor: "",
		country: "",
		budget: "",
		food_preference: "",
		activity_preference: "",
		other_requirements: "",
	});
	const [errors, setErrors] = useState({});
	const { isSubmitting, toggleSubmitting } = useSubmit(); // State to track loading status
	const { showLoading, showSuccess, hide } = usePopup();
	const navigate = useNavigate();

	// Redirect to login if no token is present
	useEffect(() => {
		const token = localStorage.getItem("jwt_token");
		if (!token) {
			navigate("/login");
		}
	}, [navigate]);

	// Update form data on input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// Validate the form
	const validateForm = () => {
		const newErrors = {};
		for (const key in formData) {
			if (formData[key] === "") {
				newErrors[key] = `${key.replace(/_/g, " ")} is required`;
			}
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		const configData = await config();
		const API_BASE_URL = configData?.API_BASE_URL || "https://datemee.click";
		if (!validateForm()) return;
		showLoading(); // Show the loading popup
		NProgress.start();
		toggleSubmitting(true); // Start loading
		console.log("NProgress started...");

		try {
			const token = localStorage.getItem("jwt_token");
			if (!token) {
				throw new Error("Token is missing, please log in.");
			}

			const response = await axios.post(`${API_BASE_URL}/plan`, formData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("Backend response:", response.data);
			showSuccess();
			setTimeout(() => {
				navigate("/result", { state: { result: response.data.result } });
			}, 3000); // 3 seconds delay
		} catch (error) {
			console.error("Error sending data to backend", error);
			alert(error.response?.data?.detail || "Something went wrong!");
		} finally {
			NProgress.done();
			toggleSubmitting(false); // End loading
			hide();
			console.log("NProgress done...");
		}
	};

	return (
		<div className="container mt-5">
			<h2>Create Your Date Plan</h2>
			<form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "600px" }}>
				{/* Start Time */}
				<label className="form-label">Start Time</label>
				<div className="mb-3 input-group">
					<span className="input-group-text">
						<i className="bi bi-clock"></i>
					</span>
					<input
						type="text"
						className={`form-control ${errors.start_time ? "is-invalid" : ""}`}
						name="start_time"
						value={formData.start_time}
						onChange={handleChange}
						disabled={isSubmitting}
						style={{ backgroundColor: isSubmitting ? "#e9ecef" : "" }}
					/>
					{errors.start_time && <div className="invalid-feedback">{errors.start_time}</div>}
				</div>

				{/* End Time */}
				<label className="form-label">End Time</label>
				<div className="mb-3 input-group">
					<span className="input-group-text">
						<i className="bi bi-clock"></i>
					</span>
					<input
						type="text"
						className={`form-control ${errors.end_time ? "is-invalid" : ""}`}
						name="end_time"
						value={formData.end_time}
						onChange={handleChange}
						disabled={isSubmitting}
						style={{ backgroundColor: isSubmitting ? "#e9ecef" : "" }}
					/>
					{errors.end_time && <div className="invalid-feedback">{errors.end_time}</div>}
				</div>

				{/* Indoor/Outdoor */}
				<label className="form-label">Indoor or Outdoor</label>
				<div className="mb-3 input-group">
					<span className="input-group-text">
						<i className="bi bi-house-door"></i>
					</span>
					<input
						type="text"
						className={`form-control ${errors.indoor_outdoor ? "is-invalid" : ""}`}
						name="indoor_outdoor"
						value={formData.indoor_outdoor}
						onChange={handleChange}
						disabled={isSubmitting}
						style={{ backgroundColor: isSubmitting ? "#e9ecef" : "" }}
					/>
					{errors.indoor_outdoor && <div className="invalid-feedback">{errors.indoor_outdoor}</div>}
				</div>

				{/* Country */}
				<label className="form-label">Country</label>
				<div className="mb-3 input-group">
					<span className="input-group-text">
						<i className="bi bi-geo-alt"></i>
					</span>
					<input
						type="text"
						className={`form-control ${errors.country ? "is-invalid" : ""}`}
						name="country"
						value={formData.country}
						onChange={handleChange}
						disabled={isSubmitting}
						style={{ backgroundColor: isSubmitting ? "#e9ecef" : "" }}
					/>
					{errors.country && <div className="invalid-feedback">{errors.country}</div>}
				</div>

				{/* Budget */}
				<label className="form-label">Budget</label>
				<div className="mb-3 input-group">
					<span className="input-group-text">
						<i className="bi bi-wallet"></i>
					</span>
					<input
						type="text"
						className={`form-control ${errors.budget ? "is-invalid" : ""}`}
						name="budget"
						value={formData.budget}
						onChange={handleChange}
						disabled={isSubmitting}
						style={{ backgroundColor: isSubmitting ? "#e9ecef" : "" }}
					/>
					{errors.budget && <div className="invalid-feedback">{errors.budget}</div>}
				</div>

				{/* Food Preference */}
				<label className="form-label">Food Preference</label>
				<div className="mb-3 input-group">
					<span className="input-group-text">
						<i className="bi bi-palette"></i>
					</span>
					<input
						type="text"
						className={`form-control ${errors.food_preference ? "is-invalid" : ""}`}
						name="food_preference"
						value={formData.food_preference}
						onChange={handleChange}
						disabled={isSubmitting}
						style={{ backgroundColor: isSubmitting ? "#e9ecef" : "" }}
					/>
					{errors.food_preference && <div className="invalid-feedback">{errors.food_preference}</div>}
				</div>

				{/* Activity Preference */}
				<label className="form-label">Activity Preference</label>
				<div className="mb-3 input-group">
					<span className="input-group-text">
						<i className="bi bi-activity"></i>
					</span>
					<input
						type="text"
						className={`form-control ${errors.activity_preference ? "is-invalid" : ""}`}
						name="activity_preference"
						value={formData.activity_preference}
						onChange={handleChange}
						disabled={isSubmitting}
						style={{ backgroundColor: isSubmitting ? "#e9ecef" : "" }}
					/>
					{errors.activity_preference && <div className="invalid-feedback">{errors.activity_preference}</div>}
				</div>

				{/* Other Requirements */}
				<div className="mb-3">
					<label className="form-label">Other Requirements</label>
					<textarea
						className={`form-control ${errors.other_requirements ? "is-invalid" : ""}`}
						name="other_requirements"
						value={formData.other_requirements}
						onChange={handleChange}
						disabled={isSubmitting}
						style={{
							backgroundColor: isSubmitting ? "#e9ecef" : "",
							height: "150px",
						}}
					/>
					{errors.other_requirements && <div className="invalid-feedback">{errors.other_requirements}</div>}
				</div>

				{/* Submit Button */}
				<div className="mb-3">
					<button type="submit" className="btn btn-primary" disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Submit"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default DatePlanForm;
