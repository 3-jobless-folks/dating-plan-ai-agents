/** @format */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DatePlanResult = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [activities, setActivities] = useState([]);

	// Load the saved date plan from localStorage
	useEffect(() => {
		// Check if a result exists in localStorage
		const savedPlan = localStorage.getItem("datePlan");
		if (savedPlan) {
			setActivities(JSON.parse(savedPlan).activities);
		}

		// If there's a new result from the form submission, update localStorage
		if (location.state?.result) {
			const newPlan = location.state.result;
			setActivities(newPlan.activities);
			localStorage.setItem("datePlan", JSON.stringify(newPlan)); // Persist the new plan
		}
	}, [location.state]);

	return (
		<div className="container mt-5 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
			<h2 className="text-center mb-4">Generated Date Plan</h2>
			{activities.length > 0 ? (
				<div className="text-center">
					<h3>Activities</h3>
					<div className="list-group">
						{activities.map((activity, index) => (
							<div key={index} className="list-group-item">
								<h4 className="fw-bold">{activity.activity}</h4>
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
									<strong>Cost:</strong> ${activity.cost}
								</p>
							</div>
						))}
					</div>
				</div>
			) : (
				<p className="text-center">No activities generated yet. Please make sure to submit the form.</p>
			)}

			{/* Buttons to navigate */}
			<div className="mt-4 d-flex gap-3">
				{/* Go back to Date Planner */}
				<button className="btn btn-primary btn-lg" onClick={() => navigate("/dateplan")}>
					<i className="bi bi-arrow-left"></i> Go Back to Date Planner
				</button>

				{/* Go to User Schedules */}
				<button className="btn btn-success btn-lg" onClick={() => navigate("/userschedules")}>
					<i className="bi bi-calendar-check"></i> View My Schedules
				</button>
			</div>
		</div>
	);
};

export default DatePlanResult;
