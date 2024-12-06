/** @format */

import React, { useState, useEffect } from "react";
import config from "./config";

function UserSchedules({ userId }) {
	const [schedules, setSchedules] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [schedulesPerPage] = useState(5); // Number of schedules to display per page
	const [sortOrder, setSortOrder] = useState("asc"); // State to manage sorting order
	const [filterActivity, setFilterActivity] = useState(""); // State for filtering by activity
	const API_BASE_URL = config.API_BASE_URL;

	useEffect(() => {
		const fetchSchedules = async () => {
			try {
				// Get the token from localStorage
				const token = localStorage.getItem("jwt_token");

				if (!token) {
					throw new Error("No token found");
				}

				// Make the API call with the token in the Authorization header
				const response = await fetch(`${API_BASE_URL}/schedules/`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`, // Add the token to the header
					},
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(` ${errorData.detail || response.statusText}`);
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
	}, [API_BASE_URL]);

	if (loading) return <p>Loading schedules...</p>;
	if (error) return <p>Error: {error}</p>;

	// Pagination logic
	const indexOfLastSchedule = currentPage * schedulesPerPage;
	const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
	const currentSchedules = schedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

	// Sorting logic
	const sortedSchedules = [...currentSchedules].sort((a, b) => {
		const aDate = new Date(a.created_at);
		const bDate = new Date(b.created_at);
		return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
	});

	// Filtering by activity
	const filteredSchedules = filterActivity
		? sortedSchedules.filter((schedule) => schedule.activities.some((activity) => activity.activity.toLowerCase().includes(filterActivity.toLowerCase())))
		: sortedSchedules;

	// Change page
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString("en-US", {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
		});
	};

	return (
		<div className="container mt-4">
			<h3 className="mb-4">User Schedules</h3>

			{/* Sorting and Filtering Controls */}
			<div className="mb-3 d-flex justify-content-between">
				{/* Sort Dropdown */}
				<div>
					<select className="form-select" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
						<option value="asc">Sort by Date (Ascending)</option>
						<option value="desc">Sort by Date (Descending)</option>
					</select>
				</div>

				{/* Filter Activity */}
				<div>
					<input type="text" className="form-control" placeholder="Filter by activity" value={filterActivity} onChange={(e) => setFilterActivity(e.target.value)} />
				</div>
			</div>

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
						{filteredSchedules.length === 0 ? (
							<tr>
								<td colSpan="8" className="text-center">
									No schedules available for this user.
								</td>
							</tr>
						) : (
							filteredSchedules.map((schedule) =>
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
													<td rowSpan={schedule.activities.length}>{formatDate(schedule.created_at)}</td>
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
						{Array.from({ length: Math.ceil(filteredSchedules.length / schedulesPerPage) }, (_, index) => (
							<li className={`page-item ${currentPage === index + 1 ? "active" : ""}`} key={index}>
								<button className="page-link" onClick={() => paginate(index + 1)}>
									{index + 1}
								</button>
							</li>
						))}

						<li className="page-item">
							<button className="page-link" disabled={currentPage === Math.ceil(filteredSchedules.length / schedulesPerPage)} onClick={() => paginate(currentPage + 1)}>
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
