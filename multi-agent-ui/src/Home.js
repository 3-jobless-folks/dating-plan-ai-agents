/** @format */

// src/Home.js
import "./App.css"; // Ensure this is imported after Bootstrap
import React from "react";

const Home = () => {
	return (
		<div className="home-container text-center text-white d-flex flex-column justify-content-center align-items-center vh-100">
			<h1 className="display-4 mb-4">Welcome to Date Planner</h1>
			<p className="lead mb-5">Plan the perfect date tailored to your preferences and budget. Let's make your date unforgettable!</p>
			<a href="/dateplan" className="btn btn-primary btn-lg">
				Get Started
			</a>
		</div>
	);
};

export default Home;
