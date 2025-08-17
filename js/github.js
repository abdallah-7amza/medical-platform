document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the lesson page before running AI logic
    if (document.body.contains(document.getElementById('ask-ai-btn'))) {
        
        const askAiBtn = document.getElementById('ask-ai-btn');
        const apiKeySection = document.getElementById('api-key-section');
        const chatSection = document.getElementById('chat-section');
        const saveKeyBtn = document.getElementById('save-key-btn');
        const apiKeyInput = document.getElementById('api-key-input');
        const chatSendBtn = document.getElementById('chat-send-btn');
        const chatInput = document.getElementById('chat-input');
        const chatWindow = document.getElementById('chat-window');

        let apiKey = localStorage.getItem('openai_api_key');

        askAiBtn.addEventListener('click', () => {
            if (apiKey) {
                // If key exists, open chat directly
                apiKeySection.style.display = 'none';
                chatSection.style.display = 'block';
                askAiBtn.style.display = 'none';
            } else {
                // If no key, show the input field
                apiKeySection.style.display = 'block';
                askAiBtn.style.display = 'none';
            }
        });

        saveKeyBtn.addEventListener('click', () => {
            const key = apiKeyInput.value.trim();
            if (key.startsWith('sk-')) {
                apiKey = key;
                localStorage.setItem('openai_api_key', key);
                apiKeySection.style.display = 'none';
                chatSection.style.display = 'block';
                alert('API Key saved successfully!');
            } else {
                alert('Please enter a valid OpenAI API Key.');
            }
        });

        chatSendBtn.addEventListener('click', async () => {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            addMessageToChat('user', userMessage);
            chatInput.value = '';

            try {
                // Placeholder for AI response - In a real scenario, you would make an API call here
                const aiResponse = `This is a placeholder response for your question: "${userMessage}". In a real application, this would be a response from the AI model.`;
                addMessageToChat('ai', aiResponse);

            } catch (error) {
                addMessageToChat('ai', 'Sorry, there was an error connecting to the AI service.');
                console.error('AI Error:', error);
            }
        });

        function addMessageToChat(sender, message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', `${sender}-message`);
            messageElement.textContent = message;
            chatWindow.appendChild(messageElement);
            chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the latest message
        }
    }
});
