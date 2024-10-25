import React, { useState } from 'react';
import { Header } from '../templates/Header';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';

export const Chat = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);

  // 送信ボタンクリック時の処理
  const handleSend = () => {
    if (userInput.trim() === '') return;

    // メッセージを追加し、入力欄をクリア
    setMessages([...messages, { text: userInput, sender: 'user' }]);
    setUserInput('');

    // 簡単なボットのレスポンス例（実際にはAPI等を使う）
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'これは自動応答です', sender: 'bot' },
      ]);
    }, 1000);
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
          width: '75%', 
          maxWidth: '800px',
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          padding: 2
        }}
      >
        <Box 
          sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            marginBottom: 2 
          }}
        >
          {messages.map((message, index) => (
            <Box 
              key={index} 
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 1,
              }}
            >
              <Paper 
                sx={{
                  padding: 1, 
                  borderRadius: 2, 
                  maxWidth: '70%',
                  backgroundColor: message.sender === 'user' ? '#e0f7fa' : '#f0f0f0',
                }}
              >
                <Typography>{message.text}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="メッセージを入力..."
            sx={{ marginRight: 1 }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSend}
          >
            送信
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
