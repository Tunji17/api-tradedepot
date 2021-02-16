const express = require('express');
const userRoutes = require('../modules/user/routes')
const productRoutes = require('../modules/product/routes')
const { sendJSONResponse } = require('../utils')

const router = express.Router();

router.get('/', (req, res) => sendJSONResponse(res, 'API is Live', 'success', 200, null ));
router.use('/user', userRoutes)
router.use('/products', productRoutes)

module.exports = router
