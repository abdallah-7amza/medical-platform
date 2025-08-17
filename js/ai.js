document.addEventListener('DOMContentLoaded', () => {
    if (document.body.contains(document.getElementById('ask-ai-btn'))) {
        const askAiBtn = document.getElementById('ask-ai-btn');
        const apiKeySection = document.getElementById('api-key-section');
        const chatSection = document.getElementById('chat-section');
        const saveKeyBtn = document.getElementById('save-key-btn');
        const apiKeyInput = document.getElementById('api-key-input');
        
        let apiKey = localStorage.getItem('openai_api_key');

        askAiBtn.addEventListener('click', () => {
            askAiBtn.style.display = 'none';
            if (apiKey) {
                chatSection.style.display = 'block';
            } else {
                apiKeySection.style.display = 'block';
            }
        });

        saveKeyBtn.addEventListener('click', () => {
            const key = apiKeyInput.value.trim();
            if (key.startsWith('sk-')) {
                apiKey = key;
                localStorage.setItem('openai_api_key', key);
                apiKeySection.style.display = 'none';
                chatSection.style.display = 'block';
            } else {
                alert('Please enter a valid OpenAI API Key starting with "sk-".');
            }
        });

        // Placeholder for chat functionality
        const chatSendBtn = document.getElementById('chat-send-btn');
        chatSendBtn.addEventListener('click', () => {
            alert('AI chat functionality is not fully implemented in this version.');
        });
    }
});
