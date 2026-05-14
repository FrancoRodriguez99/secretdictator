const ROLE_COUNTS = {
  5:  { liberals: 3, fascists: 1 },
  6:  { liberals: 4, fascists: 1 },
  7:  { liberals: 4, fascists: 2 },
  8:  { liberals: 5, fascists: 2 },
  9:  { liberals: 5, fascists: 3 },
  10: { liberals: 6, fascists: 3 },
}

class Game {
  constructor(players) {
    this.playerOrder    = players.map(p => p.id)
    this.playerCount    = players.length
    this.presidentId    = players[0].id
    this.lastPresidentId  = null
    this.lastChancellorId = null
    this.phase          = 'role_reveal'
    this.confirmedCount = 0
  }

  // Returns true when every player has confirmed their role
  confirmRole() {
    this.confirmedCount++
    return this.confirmedCount >= this.playerCount
  }

  // Everyone except the president and the two term-limited players
  getEligibleCandidates() {
    return this.playerOrder.filter(id =>
      id !== this.presidentId &&
      id !== this.lastPresidentId &&
      id !== this.lastChancellorId
    )
  }

  // Move presidency clockwise to the next player
  advancePresidency() {
    this.lastPresidentId = this.presidentId
    const i = this.playerOrder.indexOf(this.presidentId)
    this.presidentId = this.playerOrder[(i + 1) % this.playerOrder.length]
  }

  // Build a shuffled role array for a given player count
  static buildRoles(playerCount) {
    const { liberals, fascists } = ROLE_COUNTS[playerCount]
    const roles = [
      ...Array(liberals).fill('LIBERAL'),
      ...Array(fascists).fill('FASCIST'),
      'HITLER',
    ]
    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roles[i], roles[j]] = [roles[j], roles[i]]
    }
    return roles
  }
}

module.exports = Game
