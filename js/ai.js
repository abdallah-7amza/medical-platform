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

        // Change the key to reflect Google Gemini
        let apiKey = localStorage.getItem('gemini_api_key'); 
        
        // Update the prompt text for the user
        apiKeySection.querySelector('p').textContent = 'To enable the AI Tutor, please enter your Google Gemini API Key.';
        apiKeyInput.placeholder = 'Enter your Gemini API Key...';

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
            if (key) { // Simple check for a non-empty key
                apiKey = key;
                localStorage.setItem('gemini_api_key', key); // Save with the new name
                apiKeySection.style.display = 'none';
                chatSection.style.display = 'block';
                alert('Gemini API Key saved successfully!');
            } else {
                alert('Please enter a valid Google Gemini API Key.');
            }
        });

        chatSendBtn.addEventListener('click', async () => {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            addMessageToChat('user', userMessage);
            chatInput.value = '';
            
            addMessageToChat('ai', 'Thinking...'); // Placeholder for loading

            // Placeholder for actual API call logic
            // In a real app, you would call the Gemini API here.
            setTimeout(() => {
                const aiResponse = `This is a placeholder response for your question about the lesson. The AI Tutor is now configured for Google Gemini.`;
                // Remove the "Thinking..." message and add the real one
                chatWindow.removeChild(chatWindow.lastChild); 
                addMessageToChat('ai', aiResponse);
            }, 1000);
        });

        function addMessageToChat(sender, message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', `${sender}-message`);
            messageElement.textContent = message;
            chatWindow.appendChild(messageElement);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }
});
