// Import necessary modules
const express = require('express');
// Import application specific modules
const placeController = require('../../controllers/place.controller');
const validate = require('../middlewares/validator');

// Create a new router instance
const router = express.Router();

// ############################################ //
// ############### Place routes ############### //
// ############################################ //
// ===== Autocomplete route ===== //
router.get('/autocomplete',
            validate.autocompleteQuery,
            placeController.getAutocomplete.bind(placeController)
);
// ===== Place details route ===== //
router.get('/details',
            validate.placeDetailsQuery,
            placeController.getPlaceDetails.bind(placeController)
);

module.exports = router;