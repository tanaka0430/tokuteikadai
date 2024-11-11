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
      const response = await axios.post(`http://127.0.0.1:8000/answer/${encodeURIComponent(userMessage)}/0`);
      console.log('API response:', response.data);
      
      // APIレスポンスから科目とURLを抽出
      const { 科目, url } = response.data;

      // 科目とURLだけのメッセージを作成
      const formattedMessage = {
        subject: 科目 || '科目名なし',
        url: url || '',
      };

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
                {/* message.text がオブジェクトなら科目とURLを展開 */}
                {typeof message.text === 'object' && message.text.subject ? (
                  <Box>
                    <Typography variant="body1">
                      <strong>{message.text.subject}</strong>
                    </Typography>
                    {message.text.url && (
                      <Link href={message.text.url} target="_blank" rel="noopener">
                        シラバスを見る
                      </Link>
                    )}
                  </Box>
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
