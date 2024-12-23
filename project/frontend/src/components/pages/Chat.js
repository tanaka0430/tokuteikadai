import React, { useState, useRef, useEffect } from 'react';
import { Header } from '../templates/Header';
import { TextField, Button, Box, Paper, Typography, Link, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useSetup } from '../hooks/useSetup';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../providers/ChatContext'; // ChatContextをインポート
const apiUrl = process.env.REACT_APP_API_URL;

export const Chat = () => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { messages, setMessages } = useChat(); // グローバルなメッセージ状態を使用
  const { defCalendarInfo } = useSetup();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null); // スクロール用の参照

  useEffect(() => {
    // メッセージが追加されるたびに最下部にスクロール
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (userInput.trim() === '') return;

    const userMessage = userInput;
    setMessages((prevMessages) => [...prevMessages, { text: userMessage, sender: 'user' }]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/answer/${encodeURIComponent(userMessage)}`,
        {
          campuses: defCalendarInfo?.campus || [],
          dayPeriodCombinations: [],
          departments: defCalendarInfo?.department || [],
          semesters: defCalendarInfo?.semester || [],
          courseName: '',
          instructorName: '',
        },
        {
          params: { calendar_id: defCalendarInfo.id },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data?.results?.length > 0) {
        response.data.results.slice(0, 4).forEach((lecture) => {
          displayLecture(lecture);
        });
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: '該当する講義が見つかりませんでした。', sender: 'bot' },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch answer:', error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: '講義データの取得に失敗しました。', sender: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const displayLecture = (lecture) => {
    const lectureMessage = formatLectureMessage(lecture);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: lectureMessage, sender: 'bot', lecture },
    ]);
  };

  const formatLectureMessage = (lecture) => (
    <Box>
      <Typography variant="body1">
        <strong>講義名:</strong> {lecture.科目}
      </Typography>
      <Typography variant="body2">
        <strong>時限:</strong> {lecture.時限}
      </Typography>
      <Typography variant="body2">
        <strong>学年:</strong> {lecture.学年}
      </Typography>
      <Link href={lecture.url} target="_blank" rel="noopener">
        シラバスを見る
      </Link>
      <Box sx={{ marginTop: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            navigate('/register-lecture', { state: { lecture } })
          }
        >
          登録/解除
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#8fbc8f'
      }}
    >
      <Header />
      <Paper
        elevation={3}
        sx={{
          width: '85%',
          maxWidth: '800px',
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: 2,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 2,
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
                  {typeof message.text === 'object' ? message.text : <Typography>{message.text}</Typography>}
                </Paper>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="メッセージを入力..."
            sx={{ marginRight: 1 }}
          />
          <Button variant="contained" color="primary" onClick={handleSend} disabled={loading}>
            送信
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
