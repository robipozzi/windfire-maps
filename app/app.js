// Add required modules
var express = require('express');
var axios = require('axios');
var dotenv = require('dotenv');
var cors = require('cors');

// Initialize application
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
	origin: ['http://localhost:4200', 'https://yourdomain.com'] // Your Angular app's domain
}));
app.use(express.json());

// Google Maps Autocomplete Proxy Endpoint
app.get('/api/places/autocomplete', async (req, res) => {
	try {
		const { input } = req.query;

		if (!input) {
			return res.status(400).json({ error: 'Input is required' });
		}

		const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
			params: {
				//input: input as string,
				input: input,
				types: 'address',
				key: process.env.GOOGLE_MAPS_API_KEY
			}
		});

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

		const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
			params: {
				//place_id: placeid as string,
				place_id: placeid,
				fields: 'address_component,formatted_address,geometry',
				key: process.env.GOOGLE_MAPS_API_KEY
			}
		});

		res.json(response.data);
	} catch (error) {
		console.error('Proxy error:', error);
		res.status(500).json({ error: 'Failed to fetch place details' });
	}
});

// Start HTTP server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});