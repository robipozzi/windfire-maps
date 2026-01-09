const validate = {
    // ===== Validate query parameters for autocomplete endpoint ===== //
    autocompleteQuery: (req, res, next) => {
        const { input } = req.query;
        
        if (!input) {
        return res.status(400).json({
            success: false,
            error: 'Input parameter is required'
        });
        }

        if (typeof input !== 'string' || input.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Input must be a non-empty string'
        });
        }

        if (input.length > 500) {
        return res.status(400).json({
            success: false,
            error: 'Input is too long (max 500 characters)'
        });
        }

        next();
    },
    // ===== Validate query parameters for place details endpoint ===== //
    placeDetailsQuery: (req, res, next) => {
        const { placeid } = req.query;
        
        if (!placeid) {
        return res.status(400).json({
            success: false,
            error: 'Place ID parameter is required'
        });
        }

        if (typeof placeid !== 'string' || placeid.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Place ID must be a non-empty string'
        });
        }

        // Google Place IDs are typically alphanumeric with specific patterns
        if (placeid.length > 200) {
        return res.status(400).json({
            success: false,
            error: 'Place ID is too long'
        });
        }

        next();
    }
};

module.exports = validate;