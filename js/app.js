document.addEventListener('DOMContentLoaded', async () => {
    
    // Check which page we are on by looking for a specific element
    const specialtyGridContainer = document.getElementById('specialty-grid');
    const lessonListContainer = document.getElementById('lesson-list');

    // --- LOGIC FOR THE HOMEPAGE (index.html) ---
    if (specialtyGridContainer) {
        const lessons = await getLessonFiles();
        
        // Find all unique specialties from the file paths
        const specialties = [...new Set(lessons.map(lesson => lesson.specialty))];
        
        if (specialties.length > 0) {
            specialtyGridContainer.innerHTML = specialties.map(specialty => `
                <a href="lessons-list.html?specialty=${specialty}" class="lesson-card">
                    <h3>${specialty.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p>Click to view all lessons for this specialty.</p>
                </a>
            `).join('');
        } else {
            specialtyGridContainer.innerHTML = '<p>No specialties found.</p>';
        }
    }

    // --- LOGIC FOR THE LESSONS LIST PAGE (lessons-list.html) ---
    if (lessonListContainer) {
        const params = new URLSearchParams(window.location.search);
        const specialty = params.get('specialty');
        
        const specialtyTitle = document.getElementById('specialty-title');
        if (specialty) {
            specialtyTitle.textContent = `${specialty.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Lessons`;
        }
        
        const allLessons = await getLessonFiles();
        const filteredLessons = allLessons.filter(lesson => lesson.specialty === specialty);

        if (filteredLessons.length > 0) {
            lessonListContainer.innerHTML = filteredLessons.map(lesson => `
                <a href="lesson.html?path=${lesson.path}" class="lesson-card">
                    <h3>${lesson.title}</h3>
                </a>
            `).join('');
        } else {
            lessonListContainer.innerHTML = '<p>No lessons found for this specialty.</p>';
        }
    }
});
