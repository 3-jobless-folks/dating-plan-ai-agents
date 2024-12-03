/** @format */

import React from "react";

const AboutPage = () => {
	return (
		<div className="container mt-5">
			{/* Container with max width to restrict text width */}
			<div className="text-center">
				<h2 className="display-4 text-primary mb-4">About Us</h2>
				<p className="lead mx-auto" style={{ maxWidth: "800px", lineHeight: "1.6" }}>
					We are a team of passionate developers committed to creating innovative solutions that help users with their everyday needs. Our goal is to provide easy-to-use applications with
					meaningful functionality, and this Date Planning app is just one of the projects we've worked on.
				</p>
				<p className="lead mx-auto" style={{ maxWidth: "800px", lineHeight: "1.6" }}>
					Our team consists of developers, designers, and product managers who collaborate to build high-quality software. We're always looking for new ways to improve and create even better
					user experiences.
				</p>
			</div>

			<h4 className="mt-5">Meet the Team</h4>
			<div className="row text-center mt-4">
				{["John Doe", "Jane Smith", "Alex Johnson"].map((name, index) => (
					<div className="col-md-4 mb-4" key={index}>
						<div className="card shadow-sm">
							<img src={index === 0 ? "/monkey.jpeg" : index === 1 ? "/panda.jpeg" : "/rabbit.jpeg"} className="card-img-top rounded-circle mx-auto d-block image-fit" alt={name} />
							<div className="card-body">
								<h5 className="card-title">{name}</h5>
								<p className="card-text">{index === 0 ? "Full Stack Developer" : index === 1 ? "Front-End Developer" : "UX/UI Designer"}</p>
								<a href={`https://www.linkedin.com/in/${name.toLowerCase().replace(" ", "")}`} className="btn btn-outline-primary btn-sm" target="_blank" rel="noopener noreferrer">
									LinkedIn
								</a>
								<a href={`https://github.com/${name.toLowerCase().replace(" ", "")}`} className="btn btn-outline-dark btn-sm ml-2" target="_blank" rel="noopener noreferrer">
									GitHub
								</a>
							</div>
						</div>
					</div>
				))}
			</div>

			<h4 className="mt-5">Our Mission</h4>
			<p className="lead mt-4 mx-auto" style={{ maxWidth: "800px", lineHeight: "1.6" }}>
				We're dedicated to solving real-world problems through technology, focusing on usability and user-centered design. Our aim is to create applications that not only meet the needs of our
				users but also provide delightful experiences.
			</p>

			<div className="text-center mt-4">
				<p>
					Thank you for using our Date Planning app! We hope it helps you plan the perfect date. If you have any questions, feel free to reach out to us via our LinkedIn or GitHub profiles.
				</p>
				<a href="/" className="btn btn-primary btn-lg mt-3">
					Go Back to Date Plan
				</a>
			</div>
		</div>
	);
};

export default AboutPage;
