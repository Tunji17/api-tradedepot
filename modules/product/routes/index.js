const express = require('express');
const { validateSchema, authenticate} = require('../../../middleware');
const { catchErrors } = require('../../../utils')
const policy = require('../policies');
const controller = require('../controllers')
const router = express.Router();

router.post('/',catchErrors(authenticate), validateSchema(policy.create), catchErrors(controller.create))
router.get('/',catchErrors(authenticate), catchErrors(controller.read))

module.exports = router
