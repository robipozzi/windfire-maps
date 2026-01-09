// Import application specific modules
const googleMapsService = require('../services/googleMaps.service');

class PlacesController {
  // ===== Handle place autocomplete requests ===== //
  async getAutocomplete(req, res, next) {
    try {
      const { input, types, components, language } = req.query;

      // Build options object from query parameters
      const options = {};
      if (types) options.types = types;
      if (components) options.components = components;
      if (language) options.language = language;

      const results = await googleMapsService.getPlaceAutocomplete(input, options);

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }
  // ===== Handle place details requests ===== //
  async getPlaceDetails(req, res, next) {
    try {
      const { placeid, fields, language } = req.query;

      // Build options object from query parameters
      const options = {};
      if (fields) options.fields = fields;
      if (language) options.language = language;

      const result = await googleMapsService.getPlaceDetails(placeid, options);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlacesController();