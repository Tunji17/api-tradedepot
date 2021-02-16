const express = require('express');
const { validateSchema, authenticate } = require('../../../middleware');
const { catchErrors } = require('../../../utils')
const policy = require('../policies');
const controller = require('../controllers')
const router = express.Router();

router.post('/register', catchErrors(authenticate), validateSchema(policy.register), catchErrors(controller.register))
router.post('/login',catchErrors(authenticate), validateSchema(policy.login), catchErrors(controller.login))

module.exports = router
