const { validate } = require('jsonschema');
const Fixture = require('../models/fixture.model');
const Team = require('../models/team.model')
const errorHandler = require('../helpers/dbErrorHandler');
const { compareTwoTeams } = require('../helpers/utils')
const fixtureSchema = require('../schema/fixtureSchema.json')



const createFixture = async (req, res, next) => {
	try {

		if (!req.user.isAdmin) {
			return res.status(403).json({
				message: 'You are not authorized'
			});
		}
		const result = validate(req.body, fixtureSchema);
		if (!result.valid) {
			return next(result.errors.map(error => error.message));
		}

		const { teamA, teamB, matchInfo } = req.body;

		const compare = await compareTwoTeams(teamA, teamB);
		if (compare) {
			return res.status(409).json({
				message: 'Same team was selected'
			});
		}

		const homeTeam = await Team.findOne({ teamName: teamA });
		const awayTeam = await Team.findOne({ teamName: teamB });
		if (!homeTeam || !awayTeam) {
			return res.status(409).json({
				message: 'Please create the teams first'
			});
		}
		const fixture = new Fixture({
			teamA,
			teamB,
			matchInfo
		});

		const results = await Fixture.find({ teamA, teamB, matchInfo });

		const itsPendingFixture = results.filter(
			result => result.status === 'pending'
		);

		if (itsPendingFixture.length >= 1) {
			return res.status(409).json({
				message: 'The fixture exist already'
			});
		}
		const createfixture = await fixture.save();
		if (createfixture) {
			return res.status(201).json({
				message: 'Fixture has been created'
			});
		}
	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error),
		});
	}
}


const removeFixture = async (req, res) => {
	const { fixtureId } = req.params;
	try {
		if (!req.user.isAdmin) {
			return res.status(403).json({
				message: 'You are not authorized'
			});
		}
		if (!fixtureId) {
			return res.status(400).json({
				message: 'Please include a fixture Id'
			});
		}
		const fixture = await Fixture.findByIdAndDelete({
			_id: fixtureId
		})
		if (!fixture) {
			return res.status(404).json({
				message: 'Fixture not found'
			})
		}
		return res.status(200).json({
			message: 'Fixture has been deleted successfully'
		});
	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error),
		});
	}
}


const editFixture = async (req, res) => {
	try {
		const { body, params } = req;
		const {
			teamA, teamB, matchInfo, status
		} = body;
		if (!req.user.isAdmin) {
			return res.status(403).json({
				message: 'You are not authorized'
			});
		}
		const { fixtureId } = params;
		const fixture = await Fixture.findByIdAndUpdate(
			{ _id: fixtureId },
			{
				$set: {
					teamA,
					teamB,
					matchInfo,
					status,
					updatedAt: Date.now()
				}
			},
			{
				useFindAndModify: false,
				omitUndefined: true
			}
		)
		if (!fixture) {
			return res.status(404).json({
				message: 'Fixture not found'
			});
		}
		return res.status(200).json({
			message: 'Fixture has been updated successfully'
		});
	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error),
		});
	}
}


const viewAFixture = async (req, res) => {
	const { fixtureId } = req.params;
	try {
		if (!req.user.isAdmin) {
			return res.status(403).json({
				message: 'You are not authorized'
			});
		}
		const fixture = await FixtureModel.findById({ _id: fixtureId }).exec();
		if (!fixture) {
			return res.status(404).json({
				message: 'Fixture not found'
			});
		}
		return res.status(200).json({
			fixture
		});
	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error),
		});
	}
}


const viewAllFixture = async (req, res) => {
	try {
		if (!req.user.isAdmin) {
			return res.status(403).json({
				message: 'You are not authorized'
			});
		}
		const fixture = await Fixture.find()
		if (!fixture) {
			return res.status(404).json({
				message: 'Fixtures not found'
			});
		}
		return res.status(200).json({
			fixture,
			count: fixture.length
		});
	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error),
		});
	}
}


const viewCompletedFixture = async (req, res) => {
	try {
		const fixture = await Fixture.find({ status: 'completed' })
		if (!fixture) {
			return res.status(404).json({
				message: 'Completed fixture not found'
			});
		}
		return res.status(200).json({
			fixture,
			count: fixture.length
		});
	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error),
		});
	}
}



const viewPendingFixture = async (req, res) => {
	try {

		const fixture = await FixtureModel.find({ status: 'pending' })
		return res.status(200).json({
			fixture,
			count: fixture.length
		});
	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error),
		});
	}
}


const searchFixture = async (req, res) => {
	try {
		const { name, date, status } = req.body;
		const { body, query } = req;
		let { page, perPage } = query;
		perPage = perPage ? parseInt(perPage, 10) : 10;
		page = page ? parseInt(page, 10) : 1;
		let { stadium } = body;
		if (name || date || stadium || status) {
			stadium = new RegExp(`^${stadium}$`, 'i');
			const fixture = await Fixture.find({
				$or: [
					{ status },
					{ 'teamA.0.name': new RegExp(`^${name}$`, 'i') },
					{ 'teamB.0.name': new RegExp(`^${name}$`, 'i') },
					{ matchInfo: { $elemMatch: { date, stadium } } }
				]
			})
				.skip((page - 1) * perPage)
				.limit(perPage)
				.sort({ createdAt: -1 })
				.exec();
			return res.status(200).json({
				fixture,
				count: fixture.length
			});
		}
	} catch (error) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(error),
		});
	}
}


module.exports = {
	searchFixture,
	viewPendingFixture,
	viewCompletedFixture,
	viewAllFixture,
	viewAFixture,
	editFixture,
	removeFixture,
	createFixture
}