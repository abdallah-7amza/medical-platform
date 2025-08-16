function getRepoDetails() {
    // We will hardcode the details to ensure they are always correct.
    // This is the fix for the problem.
    const owner = 'abdallah-7amza';
    const repo = 'medical-platform';
    return { owner, repo };
}

async function getLessonFiles() {
    const { owner, repo } = getRepoDetails();
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Could not fetch lesson list from GitHub API.');
        }
        const data = await response.json();
        const lessonFiles = data.tree
            .filter(file => file.path.startsWith('lessons/') && file.path.endsWith('.md'))
            .map(file => {
                const pathParts = file.path.split('/');
                const specialty = pathParts[1];
                const fileName = pathParts[pathParts.length - 1];
                const slug = fileName.replace('.md', '');
                const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return { path: file.path, title, specialty, slug };
            });
        return lessonFiles;
    } catch (error) {
        console.error("Error fetching lessons:", error);
        return [];
    }
}
