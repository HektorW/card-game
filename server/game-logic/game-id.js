let nextId = 'aaaa'

module.exports.createGameId = () => {
  const gameId = String(nextId) // Create new instance of string
  updateNextId(nextId)
  return gameId
}

const zCharValue = 'z'.charCodeAt(0)
const updateNextId = (id, _index = 3) => {
  const charValueAtIndex = id.charCodeAt(_index)
  if (charValueAtIndex === zCharValue) {
    id[_index] = 'a'

    if (_index > 0) {
      updateNextId(id, _index - 1)
    }
  } else {
    id[_index] = String.fromCharCode(charValueAtIndex + 1)
  }
}
