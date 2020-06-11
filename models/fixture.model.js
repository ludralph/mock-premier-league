const mongoose = require('mongoose');

const team = {
  ref: 'Team',
  type: Array,
  name: {
    type: String,
    enum: ['AFC Bournemouth', 'Arsenal', 'Aston Villa', 'Brighton & Hove Albion', 'Burnley', 'Chelsea',
      'Crystal Palace', 'Everton', 'Leicester City', 'Liverpool', 'Manchester City', 'Manchester United',
      'Newcastle United', ' Norwich City', 'Sheffield United', 'Southampton', 'Tottenham Hotspur', 'Watford',
      'West Ham United', 'Wolverhampton Wanderers']
  },
  score: { type: Number, default: 0 }
};

const fixtureSchema = mongoose.Schema({
  teamA: team,
  teamB: team,
  status: { type: String, default: 'pending' },
  matchInfo: {
    type: Array,
    date: Date,
    stadium: {
      type: String,
      enum: ['Vitality Stadium', 'The Amex', 'Turf Moor', 'Cardiff City Stadium',
        "John Smith's Stadium", 'King Power Stadium', 'Goodison Park', 'Anfield',
        'Emirates Stadium', 'Stamford Bridge', 'Selhurst Park', 'Craven Cottage',
        'Wembley Stadium', 'London Stadium', 'Etihad Stadium', 'Old Trafford',
        'St James Park', "St Mary's Stadium", 'Vicarage Road', 'Molineux Stadium']
    }
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Fixture', fixtureSchema);