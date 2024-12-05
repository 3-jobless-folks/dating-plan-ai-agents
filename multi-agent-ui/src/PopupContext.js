/** @format */

import React, { createContext, useContext, useState } from "react";

// Create a context to share the popup state
const PopupContext = createContext();

// Loading Popup Window
const LoadingPopup = ({ onClose }) => (
	<div className="modal fade show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} aria-labelledby="loadingModalLabel" aria-hidden="true">
		<div className="modal-dialog">
			<div className="modal-content">
				<div className="modal-header">
					<h5 className="modal-title" id="loadingModalLabel">
						Submitting Your Date Plan...
					</h5>
					<button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
				</div>
				<div className="modal-body">
					<p>Your date plan is being submitted.</p>
					<p>Please wait a moment!</p>
					<p>In the meantime, feel free to read about us!</p>
				</div>
			</div>
		</div>
	</div>
);

// Success Popup Window
const SuccessPopup = ({ onClose }) => (
	<div className="modal fade show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} aria-labelledby="successModalLabel" aria-hidden="true">
		<div className="modal-dialog">
			<div className="modal-content">
				<div className="modal-header">
					<h5 className="modal-title" id="successModalLabel">
						Success!
					</h5>
					<button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
				</div>
				<div className="modal-body">
					<p>Your date plan has been successfully submitted!</p>
					<p>Enjoy your date and explore more on our website!</p>
				</div>
			</div>
		</div>
	</div>
);

export const PopupProvider = ({ children }) => {
	const [popupType, setPopupType] = useState(null);

	const showLoading = () => setPopupType("loading");
	const showSuccess = () => setPopupType("success");
	const hide = () => setPopupType(null);

	return (
		<PopupContext.Provider value={{ showLoading, showSuccess, hide }}>
			{children}
			{popupType === "loading" && <LoadingPopup onClose={hide} />}
			{popupType === "success" && <SuccessPopup onClose={hide} />}
		</PopupContext.Provider>
	);
};

// Custom hook to access the context values
export const usePopup = () => useContext(PopupContext);
