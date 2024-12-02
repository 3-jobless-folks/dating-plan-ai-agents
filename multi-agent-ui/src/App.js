/** @format */

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./Navigation"; // Import Navigation
import DatePlanForm from "./DatePlanForm";
import DatePlanResult from "./DatePlanResult";
import IngestEmbeddingsForm from "./ConvertEmbeddings";
import Home from "./Home";
import Login from "./Login"; // Login component
import Register from "./Register"; // Register component

const App = () => {
	return (
		<Router>
			<div className="App">
				{/* Navigation Menu */}
				<Navigation />

				{/* Page Routes */}
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/dateplan" element={<DatePlanForm />} />
					<Route path="/result" element={<DatePlanResult />} />
					<Route path="/convertemb" element={<IngestEmbeddingsForm />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
