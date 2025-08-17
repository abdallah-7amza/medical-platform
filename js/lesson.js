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
    
    // Fetch and render lesson content
    try {
        const response = await fetch(lessonUrl);
        const markdownText = await response.text();
        lessonContentContainer.innerHTML = marked.parse(markdownText);
        fetchAndRenderQuiz(lessonPath); // Now try to fetch the quiz
    } catch (error) {
        lessonContentContainer.innerHTML = '<p>Error loading lesson content.</p>';
    }

    async function fetchAndRenderQuiz(lessonMdPath) {
        const questionPath = lessonMdPath.replace('lessons/', 'questions/').replace('.md', '.json');
        const questionUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${questionPath}`;
        
        try {
            const quizResponse = await fetch(questionUrl);
            if (!quizResponse.ok) return; // No quiz file found, do nothing.
            
            const quizData = await quizResponse.json();
            if (quizData && quizData.length > 0) {
                const testButtonContainer = document.createElement('div');
                testButtonContainer.className = 'test-button-container';
                testButtonContainer.innerHTML = `<button class="test-button">Test Yourself</button>`;
                lessonContentContainer.appendChild(testButtonContainer);
                testButtonContainer.querySelector('button').addEventListener('click', () => renderQuiz(quizData));
            }
        } catch (error) {
            console.warn("Could not load or parse quiz file.", error);
        }
    }

    function renderQuiz(quizData) {
        let userAnswers = new Array(quizData.length).fill(null);
        let currentQuestionIndex = 0;

        function renderCurrentQuestion() {
            const question = quizData[currentQuestionIndex];
            const optionsHtml = question.options.map((option, index) =>
                `<button class="option-btn" data-index="${index}">${option}</button>`
            ).join('');

            quizContainer.style.display = 'block';
            quizContainer.innerHTML = `
                <div class="quiz-container">
                    <h3>Test: ${title}</h3>
                    <p id="question-stem">${currentQuestionIndex + 1}. ${question.question}</p>
                    <div class="options-grid">${optionsHtml}</div>
                    <div id="explanation" style="display:none;"></div>
                    <div class="quiz-navigation">
                        <button id="next-btn" class="nav-btn" disabled>Next</button>
                    </div>
                </div>`;
            quizContainer.scrollIntoView({ behavior: 'smooth' });
            
            quizContainer.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', () => handleAnswerSelection(parseInt(btn.dataset.index)));
            });
            quizContainer.querySelector('#next-btn').addEventListener('click', handleNextQuestion);
        }

        function handleAnswerSelection(selectedIndex) {
            userAnswers[currentQuestionIndex] = selectedIndex;
            const question = quizData[currentQuestionIndex];
            const options = quizContainer.querySelectorAll('.option-btn');
            
            options.forEach(btn => btn.disabled = true);
            
            const selectedOptionText = options[selectedIndex].innerText;
            if (selectedOptionText === question.answer) {
                options[selectedIndex].classList.add('correct');
            } else {
                options[selectedIndex].classList.add('incorrect');
                // Find and highlight the correct answer
                options.forEach(btn => {
                    if (btn.innerText === question.answer) {
                        btn.classList.add('correct');
                    }
                });
            }

            const explanationEl = quizContainer.querySelector('#explanation');
            explanationEl.textContent = `Explanation: ${question.explanation}`;
            explanationEl.style.display = 'block';
            quizContainer.querySelector('#next-btn').disabled = false;
        }

        function handleNextQuestion() {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                renderCurrentQuestion();
            } else {
                showResults();
            }
        }
        
        function showResults() {
             let correctCount = 0;
             quizData.forEach((q, index) => {
                const selectedOptionText = q.options[userAnswers[index]];
                if (selectedOptionText === q.answer) {
                    correctCount++;
                }
             });
             const score = Math.round((correctCount / quizData.length) * 100);
             quizContainer.innerHTML = `
                <div class="quiz-container">
                    <h2>Quiz Complete!</h2>
                    <p style="text-align:center; font-size: 1.5rem;">Your Score: ${score}% (${correctCount}/${quizData.length})</p>
                    <div class="test-button-container">
                       <button class="test-button" id="retry-quiz">Retry Quiz</button>
                    </div>
                </div>`;
             quizContainer.querySelector('#retry-quiz').addEventListener('click', () => renderQuiz(quizData));
        }
        
        renderCurrentQuestion();
    }
});
