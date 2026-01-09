// Import necessary modules
const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

class GoogleMapsService {
  constructor() {
    this.apiKey = config.googleMaps.apiKey;
    this.baseUrl = config.googleMaps.url;
  }
  // ===== Fetch place autocomplete results from Google Maps API ===== //
  async getPlaceAutocomplete(input, options = {}) {
    try {
      logger.info(`Fetching autocomplete results for: ${input}`);

      if (!this.apiKey) {
        throw new Error('Google Maps API key is not configured');
      }

      if (!input || input.trim().length === 0) {
        throw new Error('Input parameter is required');
      }

      const params = {
        input: input.trim(),
        types: options.types || 'address',
        key: this.apiKey,
        ...options
      };

      const response = await axios.get(
        `${this.baseUrl}/place/autocomplete/json`,
        { 
          params,
          timeout: 5000 // 5 second timeout
        }
      );

      if (response.data.status === 'REQUEST_DENIED') {
        throw new Error('Google Maps API request denied. Check your API key.');
      }

      if (response.data.status === 'INVALID_REQUEST') {
        throw new Error('Invalid request to Google Maps API');
      }

      logger.info(`Autocomplete returned ${response.data.predictions?.length || 0} results`);

      return response.data;
    } catch (error) {
      logger.error(`Error in getPlaceAutocomplete: ${error.message}`);
      
      if (error.response) {
        throw new Error(`Google Maps API error: ${error.response.status}`);
      }
      
      throw error;
    }
  }
  // ===== Fetch place details from Google Maps API ===== //
  async getPlaceDetails(placeId, options = {}) {
    try {
      logger.info(`Fetching place details for: ${placeId}`);

      if (!this.apiKey) {
        throw new Error('Google Maps API key is not configured');
      }

      if (!placeId || placeId.trim().length === 0) {
        throw new Error('Place ID parameter is required');
      }

      const params = {
        place_id: placeId.trim(),
        fields: options.fields || 'address_component,formatted_address,geometry',
        key: this.apiKey,
        ...options
      };

      const response = await axios.get(
        `${this.baseUrl}/place/details/json`,
        { 
          params,
          timeout: 5000 // 5 second timeout
        }
      );

      if (response.data.status === 'REQUEST_DENIED') {
        throw new Error('Google Maps API request denied. Check your API key.');
      }

      if (response.data.status === 'INVALID_REQUEST') {
        throw new Error('Invalid request to Google Maps API');
      }

      if (response.data.status === 'NOT_FOUND') {
        throw new Error('Place not found');
      }

      logger.info(`Place details retrieved successfully`);

      return response.data;
    } catch (error) {
      logger.error(`Error in getPlaceDetails: ${error.message}`);
      
      if (error.response) {
        throw new Error(`Google Maps API error: ${error.response.status}`);
      }
      
      throw error;
    }
  }
}

module.exports = new GoogleMapsService();