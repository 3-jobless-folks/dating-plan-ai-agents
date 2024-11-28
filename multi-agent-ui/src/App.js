/** @format */

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DatePlanForm from "./DatePlanForm"; // Your existing DatePlanForm component
import DatePlanResult from "./DatePlanResult"; // You'll need to create this new component

const App = () => {
	return (
		<Router>
			<div className="App">
				<Routes>
					{/* The form page */}
					<Route path="/" element={<DatePlanForm />} />

					{/* The result page, after the form is submitted */}
					<Route path="/result" element={<DatePlanResult />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
