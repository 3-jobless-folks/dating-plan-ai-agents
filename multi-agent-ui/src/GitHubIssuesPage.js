/** @format */

// IssuesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Spinner, Badge } from "react-bootstrap";
import { ExclamationCircle, CheckCircle, PersonFill } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import config from "./config";

const IssuesPage = () => {
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchIssues = async () => {
			try {
				const configData = await config();
				const API_BASE_URL = configData?.API_BASE_URL || "https://datemee.click";
				const owner = "3-jobless-folks";
				const repo = "dating-plan-ai-agents";
				const response = await axios.get(`${API_BASE_URL}/issues/?owner=${owner}&repo=${repo}`);
				console.log("API Response:", response.data);
				setIssues(response.data);
			} catch (error) {
				console.error("Error fetching issues:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchIssues();
	}, []);

	if (loading) {
		return (
			<Container className="text-center mt-5">
				<Spinner animation="border" role="status" />
				<p>Loading Issues...</p>
			</Container>
		);
	}

	return (
		<Container>
			<h1 className="mt-4 mb-4">GitHub Issues</h1>
			<Table striped bordered hover responsive className="shadow-sm">
				<thead className="table-dark">
					<tr>
						<th>#</th>
						<th>Title</th>
						<th>Status</th>
						<th>Assignee</th>
						<th>Created At</th>
					</tr>
				</thead>
				<tbody>
					{issues.map((issue, index) => (
						<tr key={issue.id}>
							<td className="align-middle">{index + 1}</td>
							<td className="align-middle">
								<a href={issue.html_url} target="_blank" rel="noopener noreferrer">
									{issue.title}
								</a>
								{issue.labels.length > 0 && (
									<div className="mt-1">
										{issue.labels.map((label) => (
											<Badge
												key={label.id}
												style={{
													backgroundColor: `#${label.color}`,
													color: "white",
													marginRight: "4px",
												}}
											>
												{label.name}
											</Badge>
										))}
									</div>
								)}
							</td>
							<td className="align-middle">
								{issue.state === "open" ? (
									<Badge bg="warning" className="text-dark">
										<ExclamationCircle /> Open
									</Badge>
								) : (
									<Badge bg="success">
										<CheckCircle /> Closed
									</Badge>
								)}
							</td>
							<td className="align-middle">
								{issue.assignee ? (
									<>
										<PersonFill className="text-primary me-1" />
										{issue.assignee.login}
									</>
								) : (
									<span className="text-muted">Unassigned</span>
								)}
							</td>
							<td className="align-middle">{new Date(issue.created_at).toLocaleDateString()}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</Container>
	);
};

export default IssuesPage;
