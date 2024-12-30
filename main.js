import './style.css';
import { fetchLocation } from './src/api/ipinfo.js';
import { generateQuestions } from './src/api/gemini.js';
import { QuizManager } from './src/quiz/quizManager.js';
import { QuizUI } from './src/ui/quizUI.js';
import { LeaderboardUI } from './src/ui/leaderboardUI.js';
import { LeaderboardService } from './src/services/leaderboardService.js';
import { LANGUAGES } from './src/constants/languages.js';
import { languageService } from './src/services/languageService.js';

const quizManager = new QuizManager();
const quizUI = new QuizUI();
const leaderboardService = new LeaderboardService();
const leaderboardUI = new LeaderboardUI(document.getElementById('leaderboard-container'));

//Initialize Ip info API
if (typeof axios === "undefined") {
  console.error("Axios failed to load.");
}
// عنصر الرابط
const merchLink = document.getElementById("merch-link");

// استدعاء الوظيفة
fetchLocation()
  .then(data => {
    const userCountry = data.country; // الدولة حسب رمز ISO (مثل "EG" لمصر)

    // تغيير الرابط بناءً على الدولة
    if (userCountry === "EG") {
      merchLink.href = "https://konohalot.shop"; // رابط مصر
    } else {
      merchLink.href = "https://konohalot.printify.me"; // رابط دولي
    }
  })
  .catch(error => {
    console.error("Failed to fetch location:", error.message);
    merchLink.href = "https://konohalot.printify.me"; // رابط افتراضي
  });
// End ip switcher


// Initialize language selector
const languageSelect = document.getElementById('language-select');
LANGUAGES.forEach(lang => {
  const option = document.createElement('option');
  option.value = lang.code;
  option.textContent = `${lang.flag} ${lang.name}`;
  languageSelect.appendChild(option);
});

// Start Quiz Handler
async function handleStartQuiz() {
  const topic = quizUI.elements.topicInput.value.trim();
  
  if (!topic) {
    quizUI.showError('Please enter a topic');
    return;
  }

  try {
    quizUI.showLoading();
    const questions = await generateQuestions(topic);
    quizManager.setQuestions(questions);
    quizUI.hideLoading();
    quizUI.showQuizContent();
    quizUI.displayQuestion(quizManager.getCurrentQuestion());
    updateProgress();
  } catch (error) {
    quizUI.showError(error.message);
  }
}

// Update progress bar
function updateProgress() {
  const progressElement = document.getElementById('progress-fill');
  const progress = ((quizManager.currentIndex + 1) / quizManager.questions.length) * 100;
  progressElement.style.width = `${progress}%`;
}

// Handle option selection
function handleOptionSelect(event) {
  if (!event.target.classList.contains('option') || event.target.style.pointerEvents === 'none') {
    return;
  }

  const selectedOption = event.target.textContent;
  const result = quizManager.checkAnswer(selectedOption);
  quizUI.markAnswer(selectedOption, result);
}

// Handle next question
function handleNextQuestion() {
  if (quizManager.nextQuestion()) {
    quizUI.displayQuestion(quizManager.getCurrentQuestion());
    quizUI.elements.nextQuestionButton.classList.add('hidden');
    updateProgress();
  } else {
    const { score, total } = quizManager.getScore();
    quizUI.showResult(score, total);
  }
}

// Handle save score
function handleSaveScore() {
  const nameInput = document.getElementById('player-name');
  const name = nameInput.value.trim();
  
  if (!name) {
    alert('Please enter your name');
    return;
  }

  const { score, total } = quizManager.getScore();
  const { rank, totalPlayers } = leaderboardService.addScore({
    name,
    score,
    total,
    topic: quizUI.elements.topicInput.value
  });

  quizUI.showFinalScore();
  document.getElementById('rank-info').textContent = `Global Rank: ${rank} of ${totalPlayers}`;
}

// Event Listeners
quizUI.elements.startQuizButton.addEventListener('click', handleStartQuiz);
quizUI.elements.optionsContainer.addEventListener('click', handleOptionSelect);
quizUI.elements.nextQuestionButton.addEventListener('click', handleNextQuestion);
document.getElementById('save-score').addEventListener('click', handleSaveScore);
quizUI.elements.restartQuizButton.addEventListener('click', () => {
  quizUI.reset();
});

languageSelect.addEventListener('change', (e) => {
  languageService.setLanguage(e.target.value);
});

document.getElementById('show-leaderboard').addEventListener('click', () => {
  const scores = leaderboardService.getScores();
  leaderboardUI.show(scores);
});

document.getElementById('share-score').addEventListener('click', () => {
  const { score, total } = quizManager.getScore();
  const scoreData = leaderboardService.getScores().find(s => s.score === score);
  if (scoreData) {
    const shareUrl = `${window.location.origin}?score=${scoreData.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  }
});