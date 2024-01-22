import React, { useState, useEffect } from 'react';
import Api from '../../Api';
const ChatWindow = ({ socket, selectedUser , currentUser }) => {
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  
  useEffect(() => {

    if (socket) {
      const handleReceivedMessage = (event) => {
        const data = JSON.parse(event.data);
        setChatMessages((prevMessages) => [...prevMessages, data]);
      };

      socket.addEventListener('message', handleReceivedMessage);

      return () => {

        socket.removeEventListener('message', handleReceivedMessage);
      };
    }
  }, [socket]);

  const sendMessage = () => {
    if (messageInput.trim() !== '' && socket) {
      socket.send(JSON.stringify({ message: messageInput, to: selectedUser, username:currentUser }));
      setMessageInput('');
    }
  };

  const fetchMessageHistory = async () => {
    try {
      const response = await Api.get(`/chats/messages/${currentUser}/${selectedUser}/`);
      setChatMessages(response.data);
    } catch (error) {
      console.error('Error fetching message history:', error);
    }
  };

  useEffect(() => {
    fetchMessageHistory()
  },[selectedUser])
  return (
    <div className="chat-window">
      <div className="messages">
        {chatMessages.map((message, index) => (
          <div key={index} className="message">
            {!message.content ? 
            <>
            <span className="username">{message.username}:</span> {message.message}
            </>
            :
            <>
            <span className='username'>{message.sender}</span>: <span>{message.content}</span>
            </>
            }
            
            
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
