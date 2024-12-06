import React, { useState } from 'react';
import { Header } from '../templates/Header';
import { TextField, Button, Box, Paper, Typography, Link } from '@mui/material';
import axios from 'axios';
import { useHomeSetupContext } from '../providers/HomeSetupProvider';
import { useLectureManagement } from '../hooks/useLectureManagement';
import RegisterButton from '../elements/RegisterButton';

export const Chat = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]); // メッセージの配列
  const { defCalendarInfo } = useHomeSetupContext();
  const { registerLecture, unregisterLecture, isLectureRegistered } = useLectureManagement(defCalendarInfo);

  const handleSend = async () => {
    if (userInput.trim() === '') return;

    const userMessage = userInput;

    // ユーザーのメッセージを追加
    setMessages([...messages, { text: userMessage, sender: 'user' }]);
    setUserInput('');

    try {
      // FastAPI エンドポイントに POST リクエストを送信
      const response = await axios.post(
        'http://localhost:8000/answer/${encodeURIComponent(userMessage)}',
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
    const isRegistered = isLectureRegistered(lecture.id); // 状態を取得
  
    return (
      <>
        <Typography variant="body1">
          <strong>講義名:</strong> {lecture.科目 || '不明'}
        </Typography>
        <Typography variant="body2">
          <strong>時限:</strong> {lecture.時限 || '不明'}
        </Typography>
        {lecture.url && (
          <Link href={lecture.url} target="_blank" rel="noopener">
            シラバスを見る
          </Link>
        )}
        <Typography variant="body2">
          {/* RegisterButton に isRegistered を渡す */}
          <RegisterButton
            isRegistered={isRegistered} // 登録状態を渡す
            onRegister={() => registerLecture(lecture.id)} // 登録処理
            onUnregister={() => unregisterLecture(lecture.id)} // 登録解除処理
          />
        </Typography>
      </>
    );
  };
};