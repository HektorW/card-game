module.exports.getPlayerTeam = (teams, playerId) =>
  teams.find(team => team.players.some(player => player.id === playerId))

module.exports.getPlayerById = (allPlayers, playerId) =>
  allPlayers.find(player => player.id === playerId)

module.exports.getNextPlayer = (allPlayers, playerId) => {
  const player = module.exports.getPlayerById(allPlayers, playerId)
  const nextPlayerIndex = (player.index + 1) % 4
  return this.allPlayers.find(player => player.index === nextPlayerIndex)
}
