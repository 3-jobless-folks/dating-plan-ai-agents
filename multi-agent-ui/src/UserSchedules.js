/** @format */

import React, { useState, useEffect } from "react";

function UserSchedules({ userId }) {
	const [schedules, setSchedules] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [schedulesPerPage] = useState(5); // Number of schedules to display per page

	useEffect(() => {
		const fetchSchedules = async () => {
			try {
				// Get the token from localStorage
				const token = localStorage.getItem("jwt_token");

				if (!token) {
					throw new Error("No token found");
				}

				// Make the API call with the token in the Authorization header
				const response = await fetch(`http://localhost:8000/schedules/`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`, // Add the token to the header
					},
				});

				if (!response.ok) {
					throw new Error(`Error fetching schedules: ${response.statusText}`);
				}

				const data = await response.json();
				console.log(data); // Log the response for debugging
				setSchedules(data);
				setLoading(false);
			} catch (err) {
				console.error("Fetch error:", err); // Log the error for debugging
				setError(err.message);
				setLoading(false);
			}
		};

		fetchSchedules();
	}, []);

	if (loading) return <p>Loading schedules...</p>;
	if (error) return <p>Error: {error}</p>;

	// Pagination logic
	const indexOfLastSchedule = currentPage * schedulesPerPage;
	const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
	const currentSchedules = schedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

	// Change page
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div className="container mt-5">
			<h3 className="mb-4">User Schedules</h3>
			<div className="table-responsive">
				<table className="table table-bordered table-hover table-striped">
					<thead className="thead-dark">
						<tr>
							<th>ID</th>
							<th>User ID</th>
							<th>Date</th>
							<th>Activity</th>
							<th>Location</th>
							<th>Time</th>
							<th>Description</th>
							<th>Cost</th>
						</tr>
					</thead>
					<tbody>
						{currentSchedules.length === 0 ? (
							<tr>
								<td colSpan="8" className="text-center">
									No schedules available for this user.
								</td>
							</tr>
						) : (
							currentSchedules.map((schedule) =>
								// For each schedule, render the schedule info (first row)
								schedule.activities.length === 0 ? (
									<tr key={schedule.user_id}>
										<td colSpan="8" className="text-center">
											No activities available for this schedule.
										</td>
									</tr>
								) : (
									schedule.activities.map((activity, index) => (
										<tr key={index}>
											{index === 0 ? (
												<>
													<td rowSpan={schedule.activities.length}>{schedule._id}</td>
													<td rowSpan={schedule.activities.length}>{schedule.user_id}</td>
													<td rowSpan={schedule.activities.length}>{schedule.created_at}</td>
												</>
											) : null}
											<td>{activity.activity}</td>
											<td>{activity.location}</td>
											<td>{activity.time}</td>
											<td>{activity.description}</td>
											<td>{activity.cost}</td>
										</tr>
									))
								)
							)
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination Controls */}
			<div className="d-flex justify-content-center mt-4">
				<nav>
					<ul className="pagination">
						<li className="page-item">
							<button className="page-link" disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>
								Previous
							</button>
						</li>

						{/* Dynamically generate page numbers */}
						{Array.from({ length: Math.ceil(schedules.length / schedulesPerPage) }, (_, index) => (
							<li className={`page-item ${currentPage === index + 1 ? "active" : ""}`} key={index}>
								<button className="page-link" onClick={() => paginate(index + 1)}>
									{index + 1}
								</button>
							</li>
						))}

						<li className="page-item">
							<button className="page-link" disabled={currentPage === Math.ceil(schedules.length / schedulesPerPage)} onClick={() => paginate(currentPage + 1)}>
								Next
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}

export default UserSchedules;
