export class QuizUI {
  constructor() {
    this.elements = {
      topicInput: document.getElementById('topic'),
      startQuizButton: document.getElementById('start-quiz'),
      quizContent: document.getElementById('quiz-content'),
      questionText: document.getElementById('question-text'),
      optionsContainer: document.getElementById('options-container'),
      nextQuestionButton: document.getElementById('next-question'),
      resultContainer: document.getElementById('result'),
      nameInput: document.getElementById('name-input'),
      finalScore: document.getElementById('final-score'),
      scoreElement: document.getElementById('score'),
      restartQuizButton: document.getElementById('restart-quiz'),
      loadingElement: document.getElementById('loading'),
      topicSelection: document.getElementById('topic-selection'),
      errorElement: document.getElementById('error-message')
    };
  }

  showLoading() {
    this.elements.topicSelection.classList.add('hidden');
    this.elements.loadingElement.classList.remove('hidden');
    this.hideError();
  }

  hideLoading() {
    this.elements.loadingElement.classList.add('hidden');
  }

  showError(message) {
    this.elements.errorElement.textContent = message;
    this.elements.errorElement.classList.remove('hidden');
    this.elements.topicSelection.classList.remove('hidden');
    this.hideLoading();
  }

  hideError() {
    this.elements.errorElement.classList.add('hidden');
  }

  displayQuestion(question) {
    this.elements.questionText.textContent = question.question;
    this.elements.optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option';
      optionElement.textContent = option;
      this.elements.optionsContainer.appendChild(optionElement);
    });
  }

  showQuizContent() {
    this.elements.quizContent.classList.remove('hidden');
    this.elements.resultContainer.classList.add('hidden');
    this.elements.nextQuestionButton.classList.add('hidden');
    this.elements.topicSelection.classList.add('hidden');
  }

  showResult(score, total) {
    this.elements.quizContent.classList.add('hidden');
    this.elements.resultContainer.classList.remove('hidden');
    this.elements.nameInput.classList.remove('hidden');
    this.elements.finalScore.classList.add('hidden');
    this.elements.scoreElement.textContent = `${score}/${total}`;
  }

  showFinalScore() {
    this.elements.nameInput.classList.add('hidden');
    this.elements.finalScore.classList.remove('hidden');
  }

  markAnswer(selectedOption, result) {
    const options = this.elements.optionsContainer.children;
    Array.from(options).forEach(option => {
      option.style.pointerEvents = 'none';
      if (option.textContent === result.correctAnswer) {
        option.classList.add('correct');
      }
      if (option.textContent === selectedOption && !result.isCorrect) {
        option.classList.add('incorrect');
      }
    });
    this.elements.nextQuestionButton.classList.remove('hidden');
  }

  reset() {
    this.elements.resultContainer.classList.add('hidden');
    this.elements.topicSelection.classList.remove('hidden');
    this.elements.quizContent.classList.add('hidden');
    this.elements.topicInput.value = '';
    this.hideError();
  }
}