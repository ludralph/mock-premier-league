const escapeRegex = (text) => {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const compareTwoTeams = (teamA, teamB) => {
	if (teamA.length !== teamB.length) {
		return false;
   }
   return teamA.localeCompare(teamB) === 0;
};


module.exports = {
	escapeRegex,
	compareTwoTeams
}