const express = require('express');
const authController = require('../controllers/auth.controller');
const fixtureController = require('../controllers/fixture.controller');


const router = express.Router();

router.route('/fixtures')
	.post(authController.requireSignIn, authController.hasAuthorization, fixtureController.createFixture)
	.get(authController.requireSignIn, authController.hasAuthorization, fixtureController.viewAllFixture)

router.route('/fixtures/completed')
	.get(authController.requireSignIn, authController.hasAuthorization, fixtureController.viewCompletedFixture)

router.route('/fixtures/pending')
.get(authController.requireSignIn, authController.hasAuthorization, fixtureController.viewPendingFixture)


router.route('/fixtures/:id')
	.get(authController.requireSignIn, authController.hasAuthorization, fixtureController.viewAFixture)
	.put(authController.requireSignIn, authController.hasAuthorization, fixtureController.editFixture)
	.delete(authController.requireSignIn, authController.hasAuthorization, fixtureController.removeFixture);

router.route('fixtures/search')
	.post(fixtureController.searchFixture)

module.exports = router;
