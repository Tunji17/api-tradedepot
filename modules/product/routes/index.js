const express = require('express');
const { validateSchema, authenticate} = require('../../../middleware');
const { catchErrors } = require('../../../utils')
const policy = require('../policies');
const controller = require('../controllers')
const router = express.Router();

router.get('/',catchErrors(authenticate), catchErrors(controller.read))
router.post('/',catchErrors(authenticate), validateSchema(policy.create), catchErrors(controller.create))
router.post('/comments',catchErrors(authenticate), validateSchema(policy.createComments), catchErrors(controller.createComments))

module.exports = router
