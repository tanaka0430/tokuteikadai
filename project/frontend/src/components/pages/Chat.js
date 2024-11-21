import React, { useState } from 'react';
import { Header } from '../templates/Header';
import { TextField, Button, Box, Paper, Typography, Link } from '@mui/material';
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
      const response = await axios.post(
        `http://localhost:8000/answer/${encodeURIComponent(userMessage)}`,
        {query: userMessage, filters: {}},
        {headers: {'Content-Type': 'application/json'}},
      );
      console.log('API response:', response.data);

      // 講義情報の配列を取得し、最初の3件のみ抽出
      const results = response.data.results?.slice(0, 3) || [];

     // 取得した講義情報をメッセージに変換
     const formattedMessage = results.map((item) => ({
      subject: item.科目 || '科目名なし',
      url: item.url || '',
      schedule: item.時限 || '時限不明',
    }));

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: formattedMessage, sender: 'bot' },
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
          padding: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: 2,
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
                {Array.isArray(message.text) ? (
                  message.text.map((item, idx) => (
                    <Box key={idx} sx={{ marginBottom: 1 }}>
                      <Typography variant="body1">
                        <strong>{item.subject}</strong>
                      </Typography>
                      <Typography variant="body2">{item.schedule}</Typography>
                      {item.url && (
                        <Link href={item.url} target="_blank" rel="noopener">
                          シラバスを見る
                        </Link>
                      )}
                  </Box>
                  ))
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
          <Button variant="contained" color="primary" onClick={handleSend}>
            送信
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
