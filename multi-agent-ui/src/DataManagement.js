/** @format */

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // Importing sort icons from react-icons
import config from "./config";

const IngestEmbeddingsForm = () => {
	const [error, setError] = useState(null);
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [schedules, setSchedules] = useState([]);
	const [filteredSchedules, setFilteredSchedules] = useState([]);
	const [role, setRole] = useState(null);
	const [userSortOrder, setUserSortOrder] = useState("asc"); // Sorting order for users
	const [scheduleSortOrder, setScheduleSortOrder] = useState("asc"); // Sorting order for schedules

	// Pagination state
	const [userPage, setUserPage] = useState(1);
	const [schedulePage, setSchedulePage] = useState(1);
	const usersPerPage = 5;
	const schedulesPerPage = 5;

	// Fetch data and roles
	const fetchUserRole = useCallback(async () => {
		const token = localStorage.getItem("jwt_token");
		const configData = await config();
		const API_BASE_URL = configData?.API_BASE_URL || "https://datemee.click";
		if (token) {
			try {
				const response = await axios.get(`${API_BASE_URL}/get_user_role`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setRole(response.data.role);
			} catch (error) {
				console.error("Error fetching user role:", error);
				setError("Failed to fetch user role.");
			}
		}
	}, []);

	const fetchUsers = useCallback(async () => {
		const configData = await config();
		const API_BASE_URL = configData?.API_BASE_URL || "https://datemee.click";
		try {
			const response = await axios.get(`${API_BASE_URL}/get_users`);
			setUsers(response.data);
			setFilteredUsers(response.data);
		} catch (error) {
			console.error("Error fetching users:", error);
			setError("Failed to fetch users.");
		}
	}, []);

	const fetchSchedules = useCallback(async () => {
		const configData = await config();
		const API_BASE_URL = configData?.API_BASE_URL || "https://datemee.click";
		try {
			const response = await axios.get(`${API_BASE_URL}/get_schedules`);
			setSchedules(response.data);
			setFilteredSchedules(response.data);
		} catch (error) {
			console.error("Error fetching schedules:", error);
			setError("Failed to fetch schedules.");
		}
	}, []);

	useEffect(() => {
		fetchUsers();
		fetchSchedules();
		fetchUserRole();
	}, [fetchSchedules, fetchUserRole, fetchUsers]);

	if (role !== "admin") {
		return <div>You do not have permission to access this page.</div>;
	}

	// Handle search for users
	const handleUserSearch = (event) => {
		const query = event.target.value.toLowerCase();
		const filtered = users.filter((user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query));
		setFilteredUsers(filtered);
		setUserPage(1); // Reset to first page when searching
	};

	// Handle search for schedules
	const handleScheduleSearch = (event) => {
		const query = event.target.value.toLowerCase();
		const filtered = schedules.filter((schedule) => schedule.user_id.toLowerCase().includes(query) || schedule.activities.some((activity) => activity.activity.toLowerCase().includes(query)));
		setFilteredSchedules(filtered);
		setSchedulePage(1); // Reset to first page when searching
	};

	// Handle sorting for users
	const sortUsers = (field) => {
		const order = userSortOrder === "asc" ? "desc" : "asc";
		const sorted = [...filteredUsers].sort((a, b) => {
			if (a[field] < b[field]) return order === "asc" ? -1 : 1;
			if (a[field] > b[field]) return order === "asc" ? 1 : -1;
			return 0;
		});
		setUserSortOrder(order);
		setFilteredUsers(sorted);
	};

	// Handle sorting for schedules
	const sortSchedules = (field) => {
		const order = scheduleSortOrder === "asc" ? "desc" : "asc";
		const sorted = [...filteredSchedules].sort((a, b) => {
			if (a[field] < b[field]) return order === "asc" ? -1 : 1;
			if (a[field] > b[field]) return order === "asc" ? 1 : -1;
			return 0;
		});
		setScheduleSortOrder(order);
		setFilteredSchedules(sorted);
	};

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

	// Pagination logic
	const userIndexOfLast = userPage * usersPerPage;
	const userIndexOfFirst = userIndexOfLast - usersPerPage;
	const currentUsers = filteredUsers.slice(userIndexOfFirst, userIndexOfLast);

	const scheduleIndexOfLast = schedulePage * schedulesPerPage;
	const scheduleIndexOfFirst = scheduleIndexOfLast - schedulesPerPage;
	const currentSchedules = filteredSchedules.slice(scheduleIndexOfFirst, scheduleIndexOfLast);

	// Handle page change for users
	const handleUserPageChange = (pageNumber) => {
		setUserPage(pageNumber);
	};

	// Handle page change for schedules
	const handleSchedulePageChange = (pageNumber) => {
		setSchedulePage(pageNumber);
	};

	return (
		<div className="container mt-4">
			{/* Search and Filter Users */}
			<div className="mb-3">
				<h3>Users</h3>
				<input type="text" className="form-control" placeholder="Search users by name or email..." onChange={handleUserSearch} />
				<div className="table-responsive mt-3">
					<table className="table table-striped table-bordered">
						<thead className="table-dark">
							<tr>
								<th onClick={() => sortUsers("index_id")}>ID {userSortOrder === "asc" ? <FaSortUp /> : userSortOrder === "desc" ? <FaSortDown /> : <FaSort />}</th>
								<th onClick={() => sortUsers("name")}>Name {userSortOrder === "asc" ? <FaSortUp /> : userSortOrder === "desc" ? <FaSortDown /> : <FaSort />}</th>
								<th onClick={() => sortUsers("email")}>Email {userSortOrder === "asc" ? <FaSortUp /> : userSortOrder === "desc" ? <FaSortDown /> : <FaSort />}</th>
								<th onClick={() => sortUsers("age")}>Age {userSortOrder === "asc" ? <FaSortUp /> : userSortOrder === "desc" ? <FaSortDown /> : <FaSort />}</th>
							</tr>
						</thead>
						<tbody>
							{currentUsers.length === 0 ? (
								<tr>
									<td colSpan="4" className="text-center">
										No users available.
									</td>
								</tr>
							) : (
								currentUsers.map((user) => (
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
					<div className="d-flex justify-content-center mt-3">
						<ul className="pagination">
							{[...Array(Math.ceil(filteredUsers.length / usersPerPage))].map((_, index) => (
								<li key={index} className={`page-item ${userPage === index + 1 ? "active" : ""}`}>
									<button className="page-link" onClick={() => handleUserPageChange(index + 1)}>
										{index + 1}
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			{/* Search and Filter Schedules */}
			<div className="mb-3">
				<h3>Schedules</h3>
				<input type="text" className="form-control" placeholder="Search schedules by user ID or activity..." onChange={handleScheduleSearch} />
				<div className="table-responsive mt-3">
					<table className="table table-striped table-bordered">
						<thead className="table-dark">
							<tr>
								<th onClick={() => sortSchedules("index_id")}>ID {scheduleSortOrder === "asc" ? <FaSortUp /> : scheduleSortOrder === "desc" ? <FaSortDown /> : <FaSort />}</th>
								<th onClick={() => sortSchedules("user_id")}>User ID {scheduleSortOrder === "asc" ? <FaSortUp /> : scheduleSortOrder === "desc" ? <FaSortDown /> : <FaSort />}</th>
								<th onClick={() => sortSchedules("created_at")}>
									Date Created {scheduleSortOrder === "asc" ? <FaSortUp /> : scheduleSortOrder === "desc" ? <FaSortDown /> : <FaSort />}
								</th>
								<th>Activities</th>
							</tr>
						</thead>
						<tbody>
							{currentSchedules.length === 0 ? (
								<tr>
									<td colSpan="4" className="text-center">
										No schedules available.
									</td>
								</tr>
							) : (
								currentSchedules.map((schedule) => (
									<tr key={schedule.index_id}>
										<td>{schedule.index_id}</td>
										<td>{schedule.user_id}</td>
										<td>{formatDate(schedule.created_at)}</td>
										<td>
											<div className="accordion" id={`accordion-${schedule.index_id}`}>
												{schedule.activities.map((activity, idx) => (
													<div className="accordion-item" key={idx}>
														<h2 className="accordion-header" id={`heading-${schedule.index_id}-${idx}`}>
															<button
																className="accordion-button text-start"
																type="button"
																data-bs-toggle="collapse"
																data-bs-target={`#collapse-${schedule.index_id}-${idx}`}
																aria-expanded="true"
																aria-controls={`collapse-${schedule.index_id}-${idx}`}
															>
																{activity.activity}
															</button>
														</h2>
														<div
															id={`collapse-${schedule.index_id}-${idx}`}
															className="accordion-collapse collapse"
															aria-labelledby={`heading-${schedule.index_id}-${idx}`}
															data-bs-parent={`#accordion-${schedule.index_id}`}
														>
															<div className="accordion-body text-start">
																<p>
																	<strong>Location:</strong> {activity.location}
																</p>
																<p>
																	<strong>Time:</strong> {activity.time}
																</p>
																<p>
																	<strong>Cost:</strong> {"$" + activity.cost}
																</p>
																<p>
																	<strong>Description:</strong> {activity.description}
																</p>
															</div>
														</div>
													</div>
												))}
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
					<div className="d-flex justify-content-center mt-3">
						<ul className="pagination">
							{[...Array(Math.ceil(filteredSchedules.length / schedulesPerPage))].map((_, index) => (
								<li key={index} className={`page-item ${schedulePage === index + 1 ? "active" : ""}`}>
									<button className="page-link" onClick={() => handleSchedulePageChange(index + 1)}>
										{index + 1}
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default IngestEmbeddingsForm;
