/** @format */

// src/Home.js
import "./App.css"; // Ensure this is imported after Bootstrap
import React from "react";

const Home = () => {
	return (
		<div className="home-container text-start text-white d-flex flex-column justify-content-center align-items-start vh-100 bg-dark px-4">
			<h1 className="display-4 mb-4 font-weight-bold">Welcome to Date Planner</h1>
			<p className="lead mb-5">
				Plan the perfect date tailored to your preferences, whether you're looking for something romantic, adventurous, or relaxing.
				<br></br>Our Date Planner ensures every detail is customized to your tastes and budget. Let us help you make your date unforgettable!
			</p>
			<div className="feature-list mb-5">
				<ul className="list-unstyled">
					<li>💡 Personalized date recommendations based on your interests</li>
					<li>💵 Budget-friendly options to suit your spending preferences</li>
					<li>🍷 Romantic, fun, and adventurous ideas for every occasion</li>
					<li>🎁 Customizable plans that adapt as you select your preferences</li>
				</ul>
			</div>
			<a href="/dateplan" className="btn btn-primary btn-lg px-4 py-2 mt-3">
				Get Started
			</a>
			<p className="mt-4">
				Already have an account?{" "}
				<a href="/login" className="text-primary">
					Log in here
				</a>
			</p>
			<p>
				Don't have an account yet?{" "}
				<a href="/register" className="text-primary">
					Register now
				</a>
			</p>
		</div>
	);
};

export default Home;
