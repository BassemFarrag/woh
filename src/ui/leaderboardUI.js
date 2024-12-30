export class LeaderboardUI {
  constructor(container) {
    this.container = container;
  }

  show(scores) {
    const leaderboardHtml = `
      <div class="leaderboard">
        <h2>Leaderboard</h2>
        <div class="leaderboard-list">
          ${scores.slice(0, 10).map((score, index) => `
            <div class="leaderboard-item">
              <span class="rank">#${index + 1}</span>
              <span class="name">${score.name}</span>
              <span class="score">${score.score}/${score.total}</span>
            </div>
          `).join('')}
        </div>
        <button id="close-leaderboard" class="secondary-button">Close</button>
      </div>
    `;
    
    this.container.innerHTML = leaderboardHtml;
    document.getElementById('close-leaderboard').onclick = () => {
      this.container.innerHTML = '';
    };
  }
}