document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const lessonPath = params.get('path');

    const lessonTitleHeader = document.getElementById('lesson-title-header');
    const lessonContentContainer = document.getElementById('lesson-content');

    if (!lessonPath) {
        lessonContentContainer.innerHTML = '<h2>Lesson not found.</h2><p>Please select a lesson from the homepage.</p>';
        return;
    }

    const title = lessonPath.split('/').pop().replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    lessonTitleHeader.textContent = title;
    document.title = title;

    const { owner, repo } = getRepoDetails();
    const lessonUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${lessonPath}`;

    try {
        const response = await fetch(lessonUrl);
        const markdownText = await response.text();
        lessonContentContainer.innerHTML = marked.parse(markdownText);
    } catch (error) {
        lessonContentContainer.innerHTML = '<p>Error loading lesson content.</p>';
        console.error("Error fetching lesson:", error);
    }
});
