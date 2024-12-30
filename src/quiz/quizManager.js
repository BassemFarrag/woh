export class QuizManager {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
  }

  setQuestions(questions) {
    this.questions = questions;
    this.currentIndex = 0;
    this.score = 0;
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  checkAnswer(selectedOption) {
    const currentQuestion = this.getCurrentQuestion();
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      this.score++;
    }
    return {
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer
    };
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  getScore() {
    return {
      score: this.score,
      total: this.questions.length
    };
  }
}