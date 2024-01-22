import React, { useEffect, useState } from 'react';
import Api from '../../Api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '../Lottie/loadingAnimation.json';
import { motion } from 'framer-motion';
import ChatWindow from './ChatWindow';

const ChatUser = ({ username, onSelectUser }) => {
  const getIconChar = () => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-gray-200 cursor-pointer"
      onClick={() => onSelectUser(username)}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
          {getIconChar()}
        </div>
        <span className="text-md text-gray-600">{username}</span>
      </div>
    </motion.div>
  );
};

const Chats = () => {
  const navigate = useNavigate();
  const [validationMessage, setValidationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setuser] = useState([]);
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const validateToken = async () => {
      const accessToken = Cookies.get('access_token');

      if (accessToken) {
        try {
          const response = await Api.get('/chatlogin/validate-token/', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log(response.data.message);
          setValidationMessage(response.data.message);
        } catch (error) {
          setValidationMessage('Token validation failed');
          navigate('/login');
        } finally {
          setIsLoading(false);
        }
      } else {
        setValidationMessage('No access token found');
      }
    };

    validateToken();
  }, []);

  useEffect(() => {
    const getUsernames = async () => {
      try {
        const response = await Api.get('/chats/users-names/', {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`,
          },
        });
        console.log(response.data.other_users_full_names);
        setuser(response.data.other_users_full_names);
        setCurrentUser(response.data.current_user_username);
      } catch (error) {
        console.log(error);
      }
    };

    getUsernames();
  }, []);

  useEffect(() => {
    const initializeSocket = () => {
      const accessToken = Cookies.get('access_token');
      if (accessToken && currentUser && selectedUser) {
        const sortedUsernames = [currentUser, selectedUser].sort().join('');
        console.log(sortedUsernames);
        const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/simple/${sortedUsernames}/`);

        newSocket.addEventListener('open', (event) => {
          console.log('Socket connected');
        });

        newSocket.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);

          if (data.sender === selectedUser || data.sender === currentUser) {
            setSocket((prevSocket) => {
              if (prevSocket && prevSocket.readyState === WebSocket.OPEN) {
                prevSocket.send(JSON.stringify({ message: messageInput, to: selectedUser }));
              }
              return prevSocket;
            });
            setMessages((prevMessages) => [...prevMessages, { sender: data.sender, content: data.content }]);
          }
        });

        newSocket.addEventListener('close', (event) => {
          console.log('Socket disconnected');
        });

        setSocket((prevSocket) => {
          if (prevSocket && prevSocket.readyState === WebSocket.OPEN) {
            prevSocket.close();
          }
          return newSocket;
        });
      }
    };

    initializeSocket();

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [selectedUser]);

  return (
    <div className="flex h-screen bg-gray-100">
      {isLoading && <Lottie animationData={loadingAnimation} loop={true} className="w-full h-screen" />}
      {validationMessage === 'Token is valid' && (
        <>
          <div className="w-1/5 bg-white p-4 border-r">
            <h6 className="text-lg font-semibold mb-4">Users List</h6>
            <div className="space-y-2">
              {user.map((username, index) => (
                <ChatUser key={index} username={username} onSelectUser={(selectedUsername) => setSelectedUser(selectedUsername)} />
              ))}
            </div>
          </div>

          <div className="w-4/5 p-4">
            <h6 className="text-lg font-semibold mb-4">Your Chats</h6>
            {selectedUser ? (
              <ChatWindow socket={socket} selectedUser={selectedUser} messages={messages} currentUser={currentUser} />
            ) : (
              <p>Select a user to start chatting.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Chats;
