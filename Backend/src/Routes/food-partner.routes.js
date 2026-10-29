const express = require('express');
const router = express.Router();
const foodPartnerController = require('../Controllers/food-partner.controller');
const authMiddleware = require('../middlewares/auth.middleware');


/* GET /api/food-partner/:id */
router.get('/:id',
    authMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartnerById
)

module.exports = router;