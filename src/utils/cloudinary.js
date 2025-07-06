const cloudinary = require("cloudinary").v2;

const connectCloudinary = () => {
	try {
			cloudinary.config({
	    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	    api_secret: process.env.CLOUDINARY_API_SECRET,
	    api_key: process.env.CLOUDINARY_API_KEY
		});
		console.log("Connected to Cloudinary successfully");
	} catch (error) {
		console.log("Could not connect to Cloudinary");
	}

}

module.exports = { connectCloudinary };