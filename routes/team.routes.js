const express = require('express');
const authController = require('../controllers/auth.controller');
const teamController = require('../controllers/team.controller')

const router = express.Router();

router.route('/teams')
	.post(authController.requireSignIn, authController.hasAuthorization, teamController.create)
	.get(authController.requireSignIn, authController.hasAuthorization, teamController.viewAllTeams)

router.route('/teams/:id')
	.get(authController.requireSignIn, authController.hasAuthorization, teamController.viewSingleTeam)
	.put(authController.requireSignIn, authController.hasAuthorization, teamController.editTeam)
	.delete(authController.requireSignIn, authController.hasAuthorization, teamController.removeTeam);

router.route('/teams/search').post(teamController.searchTeam);

module.exports = router;
