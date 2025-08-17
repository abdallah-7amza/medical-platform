document.addEventListener('DOMContentLoaded', async () => {
    const lessonListContainer = document.getElementById('lesson-list');
    
    if (lessonListContainer) {
        const lessons = await getLessonFiles();
        
        if (lessons.length > 0) {
            lessonListContainer.innerHTML = lessons.map(lesson => `
                <a href="lesson.html?path=${lesson.path}" class="lesson-card">
                    <h3>${lesson.title}</h3>
                    <p>Specialty: ${lesson.specialty}</p>
                </a>
            `).join('');
        } else {
            lessonListContainer.innerHTML = '<p>No lessons found or error loading from GitHub. Please check if the "lessons" folder exists and contains .md files.</p>';
        }
    }
});
