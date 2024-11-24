import React, { useState } from 'react';
import { Header } from '../templates/Header';
import { TextField, Button, Box, Paper, Typography, Avatar } from '@mui/material';

export const Chat = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (userInput.trim() === '') return;

    setMessages([...messages, { text: userInput, sender: 'user' }]);
    setUserInput('');

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'これは自動応答です', sender: 'bot' },
      ]);
    }, 1000);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
      }}
    >
      <Header />
      <Paper 
        elevation={3} 
        sx={{
          width: '95%', 
          maxWidth: '800px',
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          padding: 2,
          position: 'relative', 
          zIndex: 1,
        }}
      >

        <Box 
          sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            marginBottom: 2,
            zIndex: 2 
          }}
        >
          {messages.map((message, index) => (
            <Box 
              key={index} 
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'center',
                marginBottom: 1,
              }}
            >
              {message.sender === 'bot' && (
                <Avatar 
                  src="https://example.com/bot-avatar.jpg"
                  sx={{ marginRight: 1, width: 40, height: 40 }}
                />
              )}
              <Paper 
                sx={{
                  padding: 1, 
                  borderRadius: 2, 
                  maxWidth: '70%',
                  backgroundColor: '#b0c4de',
                  color: '#000000',
                }}
              >
                <Typography>{message.text}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', zIndex: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            sx={{ marginRight: 1 }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSend}
            sx={{ minWidth: 56, minHeight: 56 }} // ボタンサイズ調整
          >
            <Typography sx={{ fontSize: '2.0rem' }}>▻</Typography> {/* 送信ボタンのアイコンサイズ */}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};


