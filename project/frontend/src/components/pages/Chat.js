import React, { useState } from 'react';
import { Header } from '../templates/Header';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import axios from 'axios';

export const Chat = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);

  // 送信ボタンクリック時の処理
  const handleSend = async () => {
    if (userInput.trim() === '') return;

    const userMessage = userInput;

    // ユーザーのメッセージを追加
    setMessages([...messages, { text: userMessage, sender: 'user' }]);
    setUserInput('');

    try {
      // FastAPIエンドポイントにPOSTリクエストを送信
      const response = await axios.post(`http://127.0.0.1:8000/answer/${encodeURIComponent(userMessage)}/0`);
      console.log("API response:", response.data);  // レスポンスをログに出力
      
      const data = response.data.answer; // 応答データの取得

      // APIからの応答をメッセージに追加
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data, sender: 'bot' },
      ]);
    } catch (error) {
      console.error("Failed to fetch answer:", error.message);
      console.error("Error details:", error);
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
                {typeof message.text === 'object' ? (
                  // 「科目」のみを表示
                  <Typography>おすすめ科目は「{message.text['科目']}」です。</Typography>
                ) : (
                  <Typography>{message.text}</Typography>
                )}
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
