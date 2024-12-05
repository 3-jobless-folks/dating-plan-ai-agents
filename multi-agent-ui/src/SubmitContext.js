/** @format */

import React, { createContext, useContext, useState } from "react";

// Create the SubmitContext
const SubmitContext = createContext();

// Create a provider for the context
export const SubmitProvider = ({ children }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Toggle the submit state
	const toggleSubmitting = (state) => {
		setIsSubmitting(state);
	};

	return <SubmitContext.Provider value={{ isSubmitting, toggleSubmitting }}>{children}</SubmitContext.Provider>;
};

// Custom hook to use the submit context
export const useSubmit = () => {
	return useContext(SubmitContext);
};
