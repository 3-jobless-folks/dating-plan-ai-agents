/** @format */

import React, { createContext, useContext, useState } from "react";

// Create a context to share the popup state
const PopupContext = createContext();

// Popup window component using Bootstrap modal
const PopupWindow = ({ onClose }) => (
	<div className="modal fade show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} aria-labelledby="popupModalLabel" aria-hidden="true">
		<div className="modal-dialog">
			<div className="modal-content">
				<div className="modal-header">
					<h5 className="modal-title" id="popupModalLabel">
						Submitting Your Date Plan...
					</h5>
					<button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
				</div>
				<div className="modal-body">
					<p>Your date plan is being submitted.</p>
					<p>Please wait a moment!</p>
					<p>In the meantime, feel free to read about us!</p>
					<div className="d-flex justify-content-center">
						<button className="btn btn-primary m-2" onClick={() => (window.location.href = "/about")}>
							Go to About Page
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
);

export const PopupProvider = ({ children }) => {
	const [showPopup, setShowPopup] = useState(false);

	const show = () => setShowPopup(true);
	const hide = () => setShowPopup(false);

	return (
		<PopupContext.Provider value={{ showPopup, show, hide }}>
			{children}
			{showPopup && <PopupWindow onClose={hide} />}
		</PopupContext.Provider>
	);
};

// Custom hook to access the context values
export const usePopup = () => useContext(PopupContext);
