document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const lessonPath = params.get('path');

    const mainContainer = document.getElementById('main-container');
    const lessonTitleHeader = document.getElementById('lesson-title-header');
    const lessonContentContainer = document.getElementById('lesson-content');
    const quizContainer = document.getElementById('quiz-container');

    if (!lessonPath) {
        mainContainer.innerHTML = '<h2>Lesson not found.</h2><p>Please select a lesson from the homepage.</p>';
        return;
    }

    const title = lessonPath.split('/').pop().replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    lessonTitleHeader.textContent = title;
    document.title = title;

    const { owner, repo } = getRepoDetails();
    const lessonUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${lessonPath}`;
    const questionPath = lessonPath.replace('lessons/', 'questions/').replace('.md', '.json');
    const questionUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${questionPath}`;

    // Fetch and render lesson content
    try {
        const response = await fetch(lessonUrl);
        const markdownText = await response.text();
        lessonContentContainer.innerHTML = marked.parse(markdownText);
        // Add a "Test Yourself" button if quiz exists
        fetchAndRenderQuiz();
    } catch (error) {
        lessonContentContainer.innerHTML = '<p>Error loading lesson content.</p>';
    }

    async function fetchAndRenderQuiz() {
        try {
            const quizResponse = await fetch(questionUrl);
            if (!quizResponse.ok) return; // No quiz file found, do nothing.
            
            const quizData = await quizResponse.json();
            if (quizData && quizData.length > 0) {
                const testButton = document.createElement('div');
                testButton.classList.add('test-button-container');
                testButton.innerHTML = `<button class="test-button">Test Yourself</button>`;
                lessonContentContainer.appendChild(testButton);

                testButton.querySelector('button').addEventListener('click', () => {
                    renderQuiz(quizData);
                });
            }
        } catch (error) {
            console.error("Could not load quiz.", error);
        }
    }

    function renderQuiz(quizData) {
        let userAnswers = new Array(quizData.length).fill(null);
        let currentQuestionIndex = 0;

        function renderQuestion() {
            const question = quizData[currentQuestionIndex];
            const optionsHtml = question.options.map((option, index) =>
                `<button class="option-btn" data-index="${index}">${option}</button>`
            ).join('');

            quizContainer.innerHTML = `
                <div class="quiz-container">
                    <p id="question-stem">${currentQuestionIndex + 1}. ${question.question}</p>
                    <div class="options-grid">${optionsHtml}</div>
                    <div id="explanation" style="display:none;"></div>
                    <div class="quiz-navigation">
                        <button id="next-btn" class="nav-btn" disabled>Next</button>
                    </div>
                </div>
            `;
            quizContainer.scrollIntoView({ behavior: 'smooth' });
            addQuizListeners();
        }

        function addQuizListeners() {
            quizContainer.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    handleAnswer(parseInt(e.target.dataset.index));
                });
            });
            quizContainer.querySelector('#next-btn').addEventListener('click', handleNext);
        }

        function handleAnswer(selectedIndex) {
            userAnswers[currentQuestionIndex] = selectedIndex;
            const question = quizData[currentQuestionIndex];
            const options = quizContainer.querySelectorAll('.option-btn');
            
            options.forEach((btn, index) => {
                btn.disabled = true;
                if (index === question.answer) { // Check against string answer from your new format
                    btn.classList.add('correct');
                } else if (index === selectedIndex) {
                    btn.classList.add('incorrect');
                }
            });

            const explanationEl = quizContainer.querySelector('#explanation');
            explanationEl.textContent = `Explanation: ${question.explanation}`;
            explanationEl.style.display = 'block';
            quizContainer.querySelector('#next-btn').disabled = false;
        }

        function handleNext() {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                renderQuestion();
            } else {
                showResults();
            }
        }
        
        function showResults() {
             let correctAnswers = 0;
             quizData.forEach((q, index) => {
                const selectedOptionText = q.options[userAnswers[index]];
                if (selectedOptionText === q.answer) {
                    correctAnswers++;
                }
             });
             const score = Math.round((correctAnswers / quizData.length) * 100);
             quizContainer.innerHTML = `
                <div class="quiz-container">
                    <h2>Quiz Complete!</h2>
                    <p style="text-align:center; font-size: 1.5rem;">Your Score: ${score}%</p>
                    <div class="test-button-container">
                       <button class="test-button" id="retry-quiz">Retry Quiz</button>
                    </div>
                </div>
             `;
             quizContainer.querySelector('#retry-quiz').addEventListener('click', () => renderQuiz(quizData));
        }

        renderQuestion();
    }
});
