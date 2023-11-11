document.addEventListener('DOMContentLoaded', function() {
    const ws = new WebSocket('wss://media.agent4.ai/chat/Your_Agent_Key');
    const chatOutput = document.getElementById('chat-output');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    ws.onopen = function(event) {
        console.log("Connected to the WebSocket");
    };

    ws.onmessage = function(event) {
        let receivedData = JSON.parse(event.data);
        if (receivedData.message) {
            appendMessage("Bot", receivedData.message);
        }
    };

    sendBtn.onclick = function() {
        let message = chatInput.value.trim();
        if (message) {
            appendMessage("You", message);
            ws.send(JSON.stringify({ messageType: "userMessage", messageContent: message }));
            chatInput.value = '';
        }
    };

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    function appendMessage(sender, message) {
        let messageDiv = document.createElement('div');
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatOutput.appendChild(messageDiv);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
});
