const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
	teamName: {
		type: String,
		unique: true,
		enum: ['AFC Bournemouth', 'Arsenal', 'Aston Villa', 'Brighton & Hove Albion', 'Burnley', 'Chelsea',
			'Crystal Palace', 'Everton', 'Leicester City', 'Liverpool', 'Manchester City', 'Manchester United',
			'Newcastle United', ' Norwich City', 'Sheffield United', 'Southampton', 'Tottenham Hotspur', 'Watford',
			'West Ham United', 'Wolverhampton Wanderers']
	},
	teamMembers: {
		name: {
			type: String,
			required: true
		},
		role: {
			type: String,
			enum: ['Goal Keeper', 'Central Back', 'Central Midfield', 'Central Forward', 'Left Wing', 'Attacking Midfield', 'Central Forward', 'Left Midfielder', 'Striker', 'Defending', 'Right Midfielder'],
			required: true
		},
		type: Array
	},
	description: String,
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
		default: Date.now()
	},
});

module.exports = mongoose.model('Team', teamSchema);