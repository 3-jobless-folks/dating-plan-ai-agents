/** @format */

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./Navigation"; // Import Navigation
import DatePlanForm from "./DatePlanForm";
import DatePlanResult from "./DatePlanResult";
import IngestEmbeddingsForm from "./ConvertEmbeddings";
import Home from "./Home";

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
				</Routes>
			</div>
		</Router>
	);
};

export default App;
