module.exports.getPlayerTeam = (teams, playerId) =>
  teams.find(team => team.players.some(player => player.id === playerId))

module.exports.getPlayerById = (players, playerId) =>
  players.find(player => player.id === playerId)
