/** @format */

import React from "react";
import { useLocation } from "react-router-dom";

const DatePlanResult = () => {
	const location = useLocation();
	const { activities } = location.state?.result || {};

	return (
		<div className="container mt-5">
			<h2>Final Date Plan</h2>
			{activities ? (
				<div>
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
				<p>No activities available. Please make sure to submit the form.</p>
			)}
		</div>
	);
};

export default DatePlanResult;
