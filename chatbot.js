(function() {
    // Create chatbot container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.innerHTML = `
        <div id="chat-output-wrapper">
        <div id="chat-output">
        </div>
        <div id="typing-indicator" style="display:none;"><strong>Bot:</strong> <span class="dots"></span></div>
        </div>
        <div id="chat-input-wrapper"><input type="text" id="chat-input" placeholder="Type your message...">
        <button id="send-btn">Send</button></div>
        <div class="resizer" id="resizer"></div>
    `;

    // Append chatbot container to body
    document.body.appendChild(chatContainer);

    // Connect to WebSocket
    const ws = new WebSocket('wss://media.agent4.ai/chat/NTlhODFkMWMtNzg0OC0xMWVlLTg5MTktMGE1OGE5ZmVhYzAy');
    //const ws = new WebSocket('wss://centipede.ngrok.app/chat/NTlhODFkMWMtNzg0OC0xMWVlLTg5MTktMGE1OGE5ZmVhYzAy/');

    const chatOutput = document.getElementById('chat-output');
    const chatOutputWrapper = document.getElementById('chat-output-wrapper');

    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const typingIndicator = document.getElementById('typing-indicator');

    ws.onopen = function(event) {
        console.log("Connected to the WebSocket");
    };

    ws.onmessage = function(event) {
        let receivedData = JSON.parse(event.data);
        typingIndicator.style.display = 'none';
        let computedStyle = window.getComputedStyle(chatOutput);
        let currentMaxHeight = parseInt(computedStyle.maxHeight, 10);
        chatOutput.style.maxHeight = (currentMaxHeight + 30) + 'px';


        if (receivedData.message) {
            chatOutput.innerHTML += `<p><strong>Bot:</strong> ${receivedData.message}</p>`;
            chatOutput.scrollTop = chatOutput.scrollHeight;
        }

    };

    sendBtn.onclick = function() {
        let message = chatInput.value;

        // Create a JSON object for the message
        let jsonData = JSON.stringify({
            messageType: "userMessage",
            messageContent: message
        });

        chatOutput.innerHTML += `<p><strong>You:</strong> ${message}</p>`;

        ws.send(jsonData);

        typingIndicator.style.display = 'block';
        let computedStyle = window.getComputedStyle(chatOutput);
        let currentMaxHeight = parseInt(computedStyle.maxHeight, 10);
        chatOutput.style.maxHeight = (currentMaxHeight - 30) + 'px';
        chatInput.value = '';
        chatOutput.scrollTop = chatOutput.scrollHeight;

    };

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    const resizer = document.getElementById('resizer');
    let isResizing = false;
    let initialX, initialY;
    
    resizer.addEventListener('mousedown', function(e) {
        isResizing = true;
        initialX = e.clientX;
        initialY = e.clientY;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', function() {
            isResizing = false;
            document.removeEventListener('mousemove', handleMouseMove);
        });
    });
    
    function handleMouseMove(e) {
        if (isResizing) {
            const deltaX = initialX - e.clientX;
            const deltaY = initialY - e.clientY;
            
            const newWidth = chatContainer.offsetWidth + deltaX;
            const newHeight = chatContainer.offsetHeight + deltaY;
            
            chatContainer.style.width = newWidth + 'px';
            chatContainer.style.height = newHeight + 'px';
            
            chatContainer.style.right = (parseInt(chatContainer.style.right) + deltaX) + 'px';
            chatContainer.style.bottom = (parseInt(chatContainer.style.bottom) + deltaY) + 'px';
            
            initialX = e.clientX;
            initialY = e.clientY;

            chatOutputWrapper.style.maxHeight = (newHeight - 60) + 'px';
            chatOutput.style.maxHeight = (newHeight - 60) + 'px';
        }
    }
    

})();