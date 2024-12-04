/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";

const GitHubIssuesPage = () => {
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch GitHub issues using the API
		axios
			.get("https://api.github.com/repos/3-jobless-folks/dating-plan-ai-agents/issues")
			.then((response) => {
				setIssues(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching GitHub issues:", error);
				setLoading(false);
			});
	}, []);

	return (
		<div className="container mt-5">
			<h2 className="text-center mb-4">Future Implementations</h2>

			{loading ? (
				<div className="text-center">Loading issues...</div>
			) : issues.length > 0 ? (
				<div className="row">
					{issues.map((issue) => (
						<div className="col-md-4 mb-4" key={issue.id}>
							<div className="card shadow-sm border-0">
								<div className="card-body">
									<h5 className="card-title text-primary">{issue.title}</h5>
									<p className="card-text text-muted">
										{/* Add check to ensure issue.body exists */}
										{issue.body ? issue.body.slice(0, 150) : ""}...
									</p>
									<a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block">
										View Issue
									</a>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<p>No issues found.</p>
			)}
		</div>
	);
};

export default GitHubIssuesPage;
