// Handles leaderboard data management
export class LeaderboardService {
  constructor() {
    this.storageKey = 'quiz_leaderboard';
  }

  getScores() {
    const scores = localStorage.getItem(this.storageKey);
    return scores ? JSON.parse(scores) : [];
  }

  addScore(data) {
    const scores = this.getScores();
    const newScore = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(this.storageKey, JSON.stringify(scores));
    
    return {
      rank: scores.findIndex(s => s.id === newScore.id) + 1,
      totalPlayers: scores.length
    };
  }

  getScoreById(id) {
    return this.getScores().find(score => score.id === id);
  }
}