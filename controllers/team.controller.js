const jwt = require('jsonwebtoken')
const config = require('../config/config');
const Team = require('../models/team.model')
const errorHandler = require('../helpers/dbErrorHandler');
const { escapeRegex } = require('../helpers/utils')

const create = async (req, res) => {
	const { teamName, teamMembers, description } = req.body;
	try {
		if (!req.user.isAdmin) {
			return res.status(403).json({
				message: 'You are not authorized'
			});
		}
		const team = await Team.create({
			teamName,
			teamMembers,
			description
		});
		if (team) {
			return res.status(201).json({
				message: 'Team created successfully'
			});
		}

	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error),
		});
	}
}

const viewAllTeams = async (req, res) => {
	try {
		const teams = await Team.find()
			.select('_id teamName teamMembers description createdAt updatedAt')
		return res.status(200).json({
			teams,
			count: teams.length
		});
	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error)
		});
	}
}

const viewSingleTeam = async (req, res) => {
	const { id } = req.params;
	try {
		const team = await Team.findById({ _id: id })
			.select('_id teamName teamMembers description createdAt updatedAt')
		if (!team) {
			return response(res, 404, 'error', {
				message: 'Team does not exist'
			});
		}
		return res.status(200).json({
			team
		});
	} catch (error) {
		console.log(error)
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error)
		});
	}
}

const editTeam = async (req, res) => {
	const { teamName, teamMembers, description } = req.body;
	try {
		if (!req.user.isAdmin) {
			return res.status(403).json({
				message: 'You are not authorized'
			});
		}
		const team = await Team.findByIdAndUpdate(
			{ _id: req.params.id }, {
			teamName,
			teamMembers,
			description,
			updatedAt: Date.now()

		},
			{
				useFindAndModify: false,
				omitUndefined: true
			}
		)
		console.log(team);

		if (!team) {
			return res.status(404).json({
				message: 'Team not found'
			});
		}
		return res.status(200).json({
			message: 'Team updated successfully'
		});
	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error)
		});
	}
}

const removeTeam = async (req, res) => {
	const { id } = req.params;
	try {
		if (!req.user.isAdmin) {
			return res.status(403).json({
				message: 'You are not authorized'
			});
		}
		const team = await Team.findByIdAndDelete({ _id: id });
		if (team) {
			return res.status(200).json({
				message: 'Team Deleted Successfully'
			});
		}
		return res.status(404).json({
			message: 'Team not found'
		});

	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error)
		});
	}
}

const searchTeam = async (req, res) => {
	const {
		teamName
	} = req.body;

	try {

		if (teamName || description || memberName) {
			const regex = new RegExp(escapeRegex(teamName), 'gi');

			const team = await Team.find(
				{
					teamName: regex
				}
			)
			console.log(team)
			return res.status(200).json({
				team,
				count: team.length
			});
		}
	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error)
		});
	}
}



module.exports = {
	create, viewAllTeams, viewSingleTeam, editTeam, removeTeam, searchTeam
}