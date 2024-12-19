/** @format */

const config = async () => {
	try {
		const response = await fetch(`${process.env.PUBLIC_URL}/config.json`); // Fetches from the public folder
		if (!response.ok) {
			throw new Error("Failed to load config.json");
		}
		const config = await response.json();
		return config;
	} catch (error) {
		console.error("Error loading config.json:", error);
		return null;
	}
};

export default config;