const express = require('express');
const { validateSchema } = require('../../../middleware');
const { catchErrors } = require('../../../utils')
const policy = require('../policies');
const controller = require('../controllers')
const router = express.Router();

router.post('/register', validateSchema(policy.register), catchErrors(controller.register))
router.post('/login', validateSchema(policy.login), catchErrors(controller.login))

module.exports = router
