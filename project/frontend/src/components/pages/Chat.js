import React, { useState, } from 'react';
import { Header } from '../templates/Header';
import { TextField, Button, Box, Paper, Typography, Link } from '@mui/material';
import axios from 'axios';
import { useRegisterLecture } from '../hooks/useRegisterLecture';
import RegisterButton from '../elements/RegisterButton';
import { useSetup } from '../hooks/useSetup';

export const Chat = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]); // メッセージの配列
  const { defCalendarInfo } = useSetup(); //デフォルトカレンダーを取得
  const { registerLecture, unregisterLecture, isLectureRegistered } = useRegisterLecture(defCalendarInfo);

  const handleSend = async () => {
    // ユーザーが何も入力しなかった場合、その後の処理を中断
    if (userInput.trim() === '') return;

    const userMessage = userInput;

    // ユーザーのメッセージを追加
    setMessages([...messages, { text: userMessage, sender: 'user' }]);
    setUserInput('');

    try {
      // FastAPI エンドポイントに POST リクエストを送信
      const response = await axios.post(
        `http://localhost:8000/answer/${encodeURIComponent(userMessage)}`,
        {
          campuses: [],
          dayPeriodCombinations: [],
          departments: [],
          semesters: [],
          courseName: '',
          instructorName: '',
        },
        {
          params: { calendar_id: defCalendarInfo.id },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('API response:', response.data);

      // 最初の講義をメッセージに追加
      if (response.data.results?.length > 0) {
        const firstLecture = formatLectureMessage(response.data.results[0]);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: firstLecture, sender: 'bot', kougi_id: response.data.results[0].id },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch answer:', error.message);
      console.error('Error details:', error.response?.data || error);
    }
  };

  const formatLectureMessage = (lecture) => {
    return (
      <>
        <Typography variant="body1">
          <strong>講義名:</strong> {lecture.科目}
        </Typography>
        <Typography variant="body2">
          <strong>時限:</strong> {lecture.時限}
        </Typography>
        <Link href={lecture.url} target="_blank" rel="noopener">
          シラバスを見る
        </Link>
        <Typography variant="body2">
          <RegisterButton
            isRegistered={isLectureRegistered(lecture.id)}
            onRegister={() => registerLecture(lecture.id)}
            onUnregister={() => unregisterLecture(lecture.id)}
          />
        </Typography>
      </>
    );
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
          ))}
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
          <Button variant="contained" color="primary" onClick={handleSend}>
            送信
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
