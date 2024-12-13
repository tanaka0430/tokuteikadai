import React, { useState } from 'react';
import { Header } from '../templates/Header'; // ヘッダーコンポーネントをインポート
import { TextField, Button, Box, Paper, Typography, Link } from '@mui/material'; // UIコンポーネントをインポート
import axios from 'axios'; // HTTP通信ライブラリ
import { useSetup } from '../hooks/useSetup'; // 初期設定のフック
import { useRegisterLecture } from '../hooks/useRegisterLecture'; // 講義の登録/解除関連のフック

export const Chat = () => {
  const [userInput, setUserInput] = useState(''); // ユーザーの入力を管理
  const [messages, setMessages] = useState([]); // チャットのメッセージを管理
  const { defCalendarInfo } = useSetup(); // デフォルトカレンダー情報を取得
  const { registerLecture, unregisterLecture, isLectureRegistered } = useRegisterLecture(defCalendarInfo); // 登録/解除フック

  // メッセージ送信時の処理
  const handleSend = async () => {
    if (userInput.trim() === '') return; // 入力が空の場合は処理を終了

    const userMessage = userInput;
    setMessages((prevMessages) => [...prevMessages, { text: userMessage, sender: 'user' }]); // ユーザーのメッセージを追加
    setUserInput(''); // 入力欄をクリア

    try {
      // サーバーにリクエストを送信
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

      // 講義が見つかった場合、メッセージとして表示
      if (response.data?.results?.length > 0) {
        response.data.results.forEach((lecture) => {
          displayLecture(lecture);
        });
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: '該当する講義が見つかりませんでした。', sender: 'bot' },
        ]);
      }
    } catch (error) {
      // エラー時のメッセージを表示
      console.error('Failed to fetch answer:', error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: '講義データの取得に失敗しました。', sender: 'bot' },
      ]);
    }
  };

  // 講義の情報を表示する
  const displayLecture = (lecture) => {
    const lectureMessage = formatLectureMessage(lecture);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: lectureMessage,
        sender: 'bot',
        kougi_id: lecture.id,
        lecture,
      },
    ]);
  };

  // 講義を登録する
  const handleRegister = async (lectureId, lectureName) => {
    const alreadyRegistered = isLectureRegistered(lectureId);

    if (alreadyRegistered) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'この講義はすでに登録済みです。', sender: 'bot' },
      ]);
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `「${lectureName}」を登録します。`, sender: 'user' },
    ]);

    try {
      await registerLecture(lectureId);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `「${lectureName}」を登録しました。`, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('登録失敗:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: '講義の登録に失敗しました。もう一度お試しください。', sender: 'bot' },
      ]);
    }
  };

  // 講義を解除する
  const handleUnregister = async (lectureId, lectureName) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `「${lectureName}」を解除します。`, sender: 'user' },
    ]);
    try {
      await unregisterLecture(lectureId);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `「${lectureName}」を解除しました。`, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('解除失敗:', error);
    }
  };

  // 講義メッセージをフォーマットする
  const formatLectureMessage = (lecture) => {
    return (
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
            onClick={() => handleRegister(lecture.id, lecture.科目)}
            sx={{ marginRight: 1 }}
          >
            登録
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleUnregister(lecture.id, lecture.科目)}
            sx={{ marginRight: 1 }}
          >
            解除
          </Button>
        </Box>
      </Box>
    );
  };

  // メインの表示部分
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Header /> {/* ヘッダーの表示 */}
      <Paper
        elevation={3}
        sx={{
          width: '75%',
          maxWidth: '800px',
          height: 'calc(100vh - 64px)', // Headerの高さを差し引く
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

        {/* 入力フォームと送信ボタン */}
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
