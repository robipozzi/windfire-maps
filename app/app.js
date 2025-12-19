// Add required modules
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Initialize application
dotenv.config();
const app = express();

// Middleware
app.use(
	cors({
		origin: ['http://localhost:4200', 'https://localhost:4200', 'https://yourdomain.com'],
	})
);
app.use(express.json());

// Google Maps Autocomplete Proxy Endpoint
app.get('/api/places/autocomplete', async (req, res) => {
	try {
		const { input } = req.query;
		if (!input) {
			return res.status(400).json({ error: 'Input is required' });
		}
		const response = await axios.get(
			'https://maps.googleapis.com/maps/api/place/autocomplete/json',
			{
				params: {
					input,
					types: 'address',
					key: process.env.GOOGLE_MAPS_API_KEY,
				},
			}
		);
		res.json(response.data);
	} catch (error) {
		console.error('Proxy error:', error);
		res.status(500).json({ error: 'Failed to fetch autocomplete results' });
	}
});

// Place Details Proxy Endpoint
app.get('/api/places/details', async (req, res) => {
	try {
		const { placeid } = req.query;
		if (!placeid) {
			return res.status(400).json({ error: 'Place ID is required' });
		}
		const response = await axios.get(
			'https://maps.googleapis.com/maps/api/place/details/json',
			{
				params: {
					place_id: placeid,
					fields: 'address_component,formatted_address,geometry',
					key: process.env.GOOGLE_MAPS_API_KEY,
				},
			}
		);
		res.json(response.data);
	} catch (error) {
		console.error('Proxy error:', error);
		res.status(500).json({ error: 'Failed to fetch place details' });
	}
});

// -----> Start the server <----- //
// HTTPS setup
// Determine port based on HTTPS enablement
var PORT = process.env.HTTP_PORT;
if (process.env.ENABLE_HTTPS === 'true') {
	console.log('🔒 HTTPS is enabled');
	PORT = process.env.HTTPS_PORT;
	// SSL setup for HTTPS
	const keyPath = path.join(__dirname, 'ssl/windfire-maps.key');
	const certPath = path.join(__dirname, 'ssl/windfire-maps.crt');
	// Check if SSL files exist
	if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
		const httpsOptions = {
			key: fs.readFileSync(keyPath),
			cert: fs.readFileSync(certPath),
		};
		// Start HTTPS server
		https.createServer(httpsOptions, app).listen(PORT, () => {
			console.log(`🔒 HTTPS Server running on https://localhost:${PORT}`);
		});
	} else {
		console.error('❌ SSL certificate files not found!');
		console.error(
			'Please generate them using: openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes'
		);
		process.exit(1);
	}
}
// Start HTTP server if HTTPS is not enabled
else {
	console.log('🔓 HTTPS is disabled');
	app.listen(PORT, () => {
		console.log(`🔓 HTTP Server running on http://localhost:${PORT}`);
	});
}